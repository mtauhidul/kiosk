import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import * as actionCreators from "../state/actionCreators/index";
import store from "../state/store";

class Utils {
  constructor(errorOutputId) {
    this.errorOutput = document.getElementById(errorOutputId) || console;
  }
  createFileFromUrl(path, url, callback) {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = () => {
      if (request.status === 200) {
        const data = new Uint8Array(request.response);
        if (window.cv) {
          window.cv.FS_createDataFile("/", path, data, true, false, false);
          callback();
        } else {
          this.printError("OpenCV not loaded.");
        }
      } else {
        this.printError(`Failed to load ${url}, status: ${request.status}`);
      }
    };
    request.onerror = () => {
      this.printError("Network error while loading " + url);
    };
    request.send();
  }
  printError(err) {
    if (this.errorOutput) {
      if (this.errorOutput.innerHTML !== undefined) {
        this.errorOutput.innerHTML = err;
      } else {
        console.error(err);
      }
    } else {
      console.error(err);
    }
  }
}

const Camera = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const { id } = useParams();
  const isPortrait = id === "patientsPicture";
  const isCard =
    id === "driversLicense" ||
    id === "insuranceCardFront" ||
    id === "insuranceCardBack";

  const [imgSrc, setImgSrc] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [cvReady, setCvReady] = useState(false);
  const [loadingError, setLoadingError] = useState(null);

  useEffect(() => {
    const loadOpenCV = () => {
      // If script is already in the DOM, do not add again
      if (document.getElementById("opencv-script")) {
        if (window.cv?.Mat) {
          setCvReady(true);
        } else {
          window.cv.onRuntimeInitialized = () => setCvReady(true);
        }
        return;
      }

      const script = document.createElement("script");
      script.id = "opencv-script";
      // Use a smaller or well-known build
      script.src = "/opencv.js";
      script.async = true;

      // onload fires when the script finishes
      script.onload = () => {
        if (window.cv?.Mat) {
          setCvReady(true);
        } else if (window.cv) {
          window.cv.onRuntimeInitialized = () => setCvReady(true);
        }
      };
      // onerror in case the script fails to load
      script.onerror = () => {
        setLoadingError("Failed to load OpenCV script from CDN.");
      };

      document.body.appendChild(script);
    };
    loadOpenCV();
  }, []);

  const capture = () => {
    if (!webcamRef.current) return;
    const screenshot = webcamRef.current.getScreenshot();
    setImgSrc(screenshot);
    processImage(screenshot);
  };

  const processImage = (imageSrc) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (isPortrait) {
        processPortrait(canvas);
      } else if (isCard) {
        processCard(canvas);
      }
    };
  };

  const processCard = (canvas) => {
    if (!cvReady || !window.cv) return;
    const cv = window.cv;

    const src = cv.imread(canvas);
    const gray = new cv.Mat();
    const blurred = new cv.Mat();
    const edged = new cv.Mat();
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();

    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
    cv.Canny(blurred, edged, 75, 200);

    cv.findContours(
      edged,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    let maxArea = 0;
    let bestRect = null;
    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);
      const rect = cv.boundingRect(cnt);
      const area = rect.width * rect.height;

      // filter out huge rectangles close to the full image
      if (rect.width >= src.cols * 0.9 || rect.height >= src.rows * 0.9) {
        continue;
      }
      // approximate card aspect ratio
      const aspect = rect.width / rect.height;
      if (aspect < 1.2 || aspect > 1.8) {
        continue;
      }
      if (area > maxArea && rect.width > 200 && rect.height > 100) {
        maxArea = area;
        bestRect = rect;
      }
    }

    if (bestRect) {
      const cropped = src.roi(bestRect);
      const outCanvas = document.createElement("canvas");
      outCanvas.width = bestRect.width;
      outCanvas.height = bestRect.height;
      cv.imshow(outCanvas, cropped);

      const result = outCanvas.toDataURL("image/jpeg", 0.95);
      setProcessedImage(result);

      cropped.delete();
    } else {
      setProcessedImage(canvas.toDataURL("image/jpeg", 0.95));
    }

    src.delete();
    gray.delete();
    blurred.delete();
    edged.delete();
    contours.delete();
    hierarchy.delete();
  };

  const processPortrait = (canvas) => {
    if (!cvReady || !window.cv) return;
    const cv = window.cv;

    const src = cv.imread(canvas);
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    const faceCascade = new cv.CascadeClassifier();
    const utils = new Utils("errorMessage");

    utils.createFileFromUrl(
      "haarcascade_frontalface_default.xml",
      "/haarcascade_frontalface_default.xml",
      () => {
        faceCascade.load("haarcascade_frontalface_default.xml");

        const faces = new cv.RectVector();
        faceCascade.detectMultiScale(gray, faces, 1.1, 4);

        if (faces.size() > 0) {
          const face = faces.get(0);
          const margin = 40;
          const cropX = Math.max(face.x - margin, 0);
          const cropY = Math.max(face.y - margin, 0);
          const cropW = Math.min(face.width + margin * 2, src.cols - cropX);
          const cropH = Math.min(face.height + margin * 2, src.rows - cropY);

          const outCanvas = document.createElement("canvas");
          outCanvas.width = 300;
          outCanvas.height = 400;
          const ctx = outCanvas.getContext("2d");
          ctx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, 300, 400);
          const result = outCanvas.toDataURL("image/jpeg", 0.95);
          setProcessedImage(result);
        } else {
          setProcessedImage(canvas.toDataURL("image/jpeg", 0.95));
        }

        src.delete();
        gray.delete();
        faceCascade.delete();
        faces.delete();
      }
    );
  };

  const updateState = (image) => {
    if (!image) return;
    const state = store.getState();
    const insuranceType = window.sessionStorage.getItem("insuranceType");

    if (id === "patientsPicture") {
      dispatch(
        actionCreators.addDemographicData({
          ...state.data.demographicsInfo,
          patientsPicture: image,
        })
      );
      navigate("/kiosk/demographics_documents");
    } else if (id === "driversLicense") {
      dispatch(
        actionCreators.addDemographicData({
          ...state.data.demographicsInfo,
          driversLicense: image,
        })
      );
      navigate("/kiosk/demographics_documents");
    } else if (id === "insuranceCardFront") {
      if (insuranceType?.includes("primary")) {
        dispatch(
          actionCreators.addPrimaryInsurance({
            ...state.data.primaryInsurance,
            insuranceCardFront: image,
          })
        );
        navigate("/kiosk/insurance_documents");
      } else {
        dispatch(
          actionCreators.addSecondaryInsurance({
            ...state.data.secondaryInsurance,
            insuranceCardFront: image,
          })
        );
        navigate("/kiosk/insurance_docs_secondary");
      }
    } else if (id === "insuranceCardBack") {
      if (insuranceType?.includes("primary")) {
        dispatch(
          actionCreators.addPrimaryInsurance({
            ...state.data.primaryInsurance,
            insuranceCardBack: image,
          })
        );
        navigate("/kiosk/insurance_documents");
      } else {
        dispatch(
          actionCreators.addSecondaryInsurance({
            ...state.data.secondaryInsurance,
            insuranceCardBack: image,
          })
        );
        navigate("/kiosk/insurance_docs_secondary");
      }
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {!loadingError ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={640}
            height={480}
            videoConstraints={{
              facingMode: isPortrait ? "user" : "environment",
            }}
          />
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {!imgSrc ? (
            <button onClick={capture} disabled={!cvReady}>
              {cvReady ? "Capture" : "Loading OpenCV..."}
            </button>
          ) : (
            <>
              <img
                src={processedImage || imgSrc}
                alt="Processed"
                width={320}
                style={{ marginTop: 16 }}
              />
              <button onClick={() => updateState(processedImage || imgSrc)}>
                Use Image
              </button>
            </>
          )}
        </>
      ) : (
        <p style={{ color: "red" }}>{loadingError}</p>
      )}
      <div id="errorMessage" style={{ color: "red", marginTop: 10 }}></div>
    </div>
  );
};

export default Camera;
