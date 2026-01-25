import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import * as actionCreators from "../state/actionCreators/index";
import store from "../state/store";
import { processImage as cloudinaryProcessImage } from "../services/cloudinaryService";

// Utility class for OpenCV operations
class OpenCVUtils {
  constructor() {
    this.errorOutput = document.getElementById("cv-error") || console;
  }

  loadFaceCascade() {
    return new Promise((resolve, reject) => {
      try {
        // Check if face detector is already created
        if (window.faceCascadeClassifier) {
          resolve(window.faceCascadeClassifier);
          return;
        }

        // Try using a pre-loaded classifier if available
        if (
          window.cv &&
          window.cv.data &&
          window.cv.data.haarcascade_frontalface_default
        ) {
          window.faceCascadeClassifier = new window.cv.CascadeClassifier();
          window.faceCascadeClassifier.load(
            window.cv.data.haarcascade_frontalface_default
          );
          resolve(window.faceCascadeClassifier);
          return;
        }

        // Fallback: We'll load the classifier asynchronously
        const request = new XMLHttpRequest();
        request.open("GET", "/haarcascade_frontalface_default.xml", true);
        request.responseType = "arraybuffer";
        request.onload = () => {
          if (request.status === 200) {
            try {
              const data = new Uint8Array(request.response);
              const dataPath = "haarcascade_frontalface_default.xml";

              if (window.cv && window.cv.FS_createDataFile) {
                // Clean up existing file if it exists to avoid errors
                try {
                  if (window.cv.FS_stat(dataPath)) {
                    window.cv.FS_unlink(dataPath);
                  }
                } catch (e) {
                  // File doesn't exist, which is fine
                }

                window.cv.FS_createDataFile(
                  "/",
                  dataPath,
                  data,
                  true,
                  false,
                  false
                );

                window.faceCascadeClassifier =
                  new window.cv.CascadeClassifier();
                window.faceCascadeClassifier.load(dataPath);
                resolve(window.faceCascadeClassifier);
              } else {
                reject("OpenCV file system not available");
              }
            } catch (err) {
              this.printError(
                "Error loading cascade classifier: " + err.message
              );
              reject(err);
            }
          } else {
            const error = `Failed to load face detection model, status: ${request.status}`;
            this.printError(error);
            reject(error);
          }
        };
        request.onerror = () => {
          const error = "Network error while loading face detection model";
          this.printError(error);
          reject(error);
        };
        request.send();
      } catch (error) {
        this.printError("Exception in loadFaceCascade: " + error.message);
        reject(error);
      }
    });
  }

  printError(err) {
    if (this.errorOutput) {
      if (typeof this.errorOutput.innerHTML !== "undefined") {
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
  const isCard = [
    "driversLicense",
    "insuranceCardFront",
    "insuranceCardBack",
  ].includes(id);

  const [imgSrc, setImgSrc] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [cvReady, setCvReady] = useState(false);
  const [loadingCV, setLoadingCV] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cameraMode, setCameraMode] = useState(
    isPortrait ? "user" : "environment"
  );

  // Document titles for user guidance
  const documentTitles = {
    patientsPicture: "Take your portrait photo",
    driversLicense: "Scan your driver's license",
    insuranceCardFront: "Scan the front of your insurance card",
    insuranceCardBack: "Scan the back of your insurance card",
  };

  // Guidelines/tips to show the user
  const documentGuidelines = {
    patientsPicture:
      "Center your face in the frame and look directly at the camera",
    driversLicense: "Place the entire license within the frame and hold steady",
    insuranceCardFront: "Make sure all text on the front is clearly visible",
    insuranceCardBack: "Make sure all text on the back is clearly visible",
  };

  // Load OpenCV library
  useEffect(() => {
    const loadOpenCV = async () => {
      setLoadingCV(true);

      // If script is already in the DOM
      if (document.getElementById("opencv-script")) {
        if (window.cv?.Mat) {
          setCvReady(true);
          setLoadingCV(false);
        } else if (window.cv) {
          window.cv.onRuntimeInitialized = () => {
            setCvReady(true);
            setLoadingCV(false);
          };
        }
        return;
      }

      try {
        const script = document.createElement("script");
        script.id = "opencv-script";
        script.src = "/opencv.js";
        script.async = true;

        script.onload = () => {
          if (window.cv?.Mat) {
            setCvReady(true);
            setLoadingCV(false);
          } else if (window.cv) {
            window.cv.onRuntimeInitialized = () => {
              setCvReady(true);
              setLoadingCV(false);
            };
          }
        };

        script.onerror = () => {
          setLoadingError(
            "Failed to load image processing library. Please try again later."
          );
          setLoadingCV(false);
        };

        document.body.appendChild(script);
      } catch (error) {
        setLoadingError(
          `Error loading image processing library: ${error.message}`
        );
        setLoadingCV(false);
      }
    };

    loadOpenCV();

    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, []);

  const capture = async () => {
    if (!webcamRef.current) return;

    try {
      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) {
        setLoadingError(
          "Failed to capture image. Please ensure camera access is granted."
        );
        return;
      }

      setImgSrc(screenshot);
      setProcessing(true);
      await processImage(screenshot);
      setProcessing(false);
    } catch (error) {
      setLoadingError(`Error capturing image: ${error.message}`);
      setProcessing(false);
    }
  };

  const processImage = async (imageSrc) => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        img.src = imageSrc;
        img.onload = async () => {
          const canvas = canvasRef.current;
          if (!canvas) {
            reject(new Error("Canvas reference not available"));
            return;
          }

          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // No local processing - send raw image to Cloudinary
          // Cloudinary will handle all cropping, enhancement, and straightening
          setProcessedImage(canvas.toDataURL("image/jpeg", 0.95));
          resolve();
        };

        img.onerror = () => {
          reject(new Error("Failed to load captured image"));
        };
      } catch (error) {
        reject(error);
      }
    });
  };

  const processCard = async (canvas) => {
    if (!cvReady || !window.cv) {
      setProcessedImage(canvas.toDataURL("image/jpeg", 0.95));
      return;
    }

    const cv = window.cv;

    try {
      const src = cv.imread(canvas);
      const gray = new cv.Mat();
      const blurred = new cv.Mat();
      const edged = new cv.Mat();
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();

      try {
        // Convert to grayscale
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        // Blur to reduce noise
        cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

        // Find edges
        cv.Canny(blurred, edged, 75, 200);

        // Find contours
        cv.findContours(
          edged,
          contours,
          hierarchy,
          cv.RETR_EXTERNAL,
          cv.CHAIN_APPROX_SIMPLE
        );

        // Find the largest rectangle with appropriate aspect ratio
        let maxArea = 0;
        let bestRect = null;

        for (let i = 0; i < contours.size(); i++) {
          const cnt = contours.get(i);
          const rect = cv.boundingRect(cnt);
          const area = rect.width * rect.height;

          // Filter out huge rectangles close to the full image
          if (rect.width >= src.cols * 0.9 || rect.height >= src.rows * 0.9) {
            continue;
          }

          // Check for card-like aspect ratio (width/height between 1.2 and 1.8)
          const aspect = rect.width / rect.height;
          if (aspect < 1.2 || aspect > 1.8) {
            continue;
          }

          // Look for reasonably sized rectangles
          if (area > maxArea && rect.width > 200 && rect.height > 100) {
            maxArea = area;
            bestRect = rect;
          }
        }

        // If we found a suitable rectangle, crop to it
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
          // If no suitable rectangle found, use the original image
          setProcessedImage(canvas.toDataURL("image/jpeg", 0.95));
        }
      } finally {
        // Clean up OpenCV resources
        src.delete();
        gray.delete();
        blurred.delete();
        edged.delete();
        contours.delete();
        hierarchy.delete();
      }
    } catch (error) {
      console.error("Error in card processing:", error);
      setProcessedImage(canvas.toDataURL("image/jpeg", 0.95));
    }
  };

  const processPortrait = async (canvas) => {
    if (!cvReady || !window.cv) {
      setProcessedImage(canvas.toDataURL("image/jpeg", 0.95));
      return;
    }

    const cv = window.cv;
    const utils = new OpenCVUtils();

    try {
      const src = cv.imread(canvas);
      const gray = new cv.Mat();

      try {
        // Convert to grayscale for face detection
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        try {
          // Load face detection classifier
          const faceCascade = await utils.loadFaceCascade();

          if (faceCascade) {
            const faces = new cv.RectVector();

            try {
              // Detect faces
              faceCascade.detectMultiScale(gray, faces, 1.1, 4);

              // If faces detected, crop to the first face
              if (faces.size() > 0) {
                const face = faces.get(0);
                const margin = 40; // Add margin around the face

                // Calculate crop bounds with margin, ensuring they stay within image bounds
                const cropX = Math.max(face.x - margin, 0);
                const cropY = Math.max(face.y - margin, 0);
                const cropW = Math.min(
                  face.width + margin * 2,
                  src.cols - cropX
                );
                const cropH = Math.min(
                  face.height + margin * 2,
                  src.rows - cropY
                );

                // Create a standard 3:4 portrait
                const outCanvas = document.createElement("canvas");
                outCanvas.width = 300;
                outCanvas.height = 400;
                const ctx = outCanvas.getContext("2d");
                ctx.drawImage(
                  canvas,
                  cropX,
                  cropY,
                  cropW,
                  cropH,
                  0,
                  0,
                  300,
                  400
                );

                const result = outCanvas.toDataURL("image/jpeg", 0.95);
                setProcessedImage(result);
              } else {
                // If no faces found, use the original image
                setProcessedImage(canvas.toDataURL("image/jpeg", 0.95));
              }
            } finally {
              // Clean up
              if (faces) faces.delete();
            }
          } else {
            // If face classifier couldn't be loaded
            setProcessedImage(canvas.toDataURL("image/jpeg", 0.95));
          }
        } catch (faceError) {
          console.error("Face detection setup error:", faceError);
          // Fallback to original image if face detection fails
          setProcessedImage(canvas.toDataURL("image/jpeg", 0.95));
        }
      } finally {
        // Clean up OpenCV resources
        src.delete();
        gray.delete();
      }
    } catch (error) {
      console.error("Error in portrait processing:", error);
      setProcessedImage(canvas.toDataURL("image/jpeg", 0.95));
    }
  };

  const flipCamera = () => {
    setCameraMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const retakePhoto = () => {
    setImgSrc(null);
    setProcessedImage(null);
  };

  // FIXED: This function was incorrectly defined and nested
  const useImage = async () => {
    if (!processedImage && !imgSrc) {
      console.log("No image captured");
      return;
    }

    const finalImage = processedImage || imgSrc;
    const state = store.getState();
    const insuranceType = window.sessionStorage.getItem("insuranceType");

    console.log("Using image for:", id);
    console.log("Insurance type:", insuranceType);

    try {
      // Process with Cloudinary based on image type
      let cloudinaryProcessedUrl = finalImage;
      const useCloudinary = process.env.REACT_APP_USE_CLOUDINARY === "true";
      
      if (useCloudinary) {
        setProcessing(true);
        console.log("📤 Processing with Cloudinary...");
        
        try {
          const patientId = sessionStorage.getItem("patientId") || "temp";
          let imageType, options = { patientId };
          
          // Determine image type and options
          if (id === "patientsPicture") {
            imageType = "portrait";
          } else if (id === "driversLicense") {
            imageType = "license";
            options.side = "front";
          } else if (id === "insuranceCardFront" || (insuranceType && id.includes("insurance"))) {
            imageType = "insurance";
            options.insuranceType = insuranceType || "primary";
            options.side = id.includes("Back") || id.includes("back") ? "back" : "front";
          }
          
          if (imageType) {
            const result = await cloudinaryProcessImage(finalImage, imageType, options);
            cloudinaryProcessedUrl = result.processedUrl;
            console.log("✅ Cloudinary processing complete:", cloudinaryProcessedUrl);
          }
        } catch (cloudinaryError) {
          console.error("⚠️ Cloudinary processing failed, using original:", cloudinaryError);
          // Fallback to original image if Cloudinary fails
        } finally {
          setProcessing(false);
        }
      }

      // Update state based on the ID parameter (use Cloudinary URL if available)
      if (id === "patientsPicture") {
        dispatch(
          actionCreators.addDemographicData({
            ...state.data.demographicsInfo,
            patientsPicture: cloudinaryProcessedUrl,
          })
        );
        navigate("/kiosk/demographics_documents");
      } else if (id === "driversLicense") {
        dispatch(
          actionCreators.addDemographicData({
            ...state.data.demographicsInfo,
            driversLicense: cloudinaryProcessedUrl,
          })
        );
        navigate("/kiosk/demographics_documents");
      } else if (id === "insuranceCardFront") {
        if (insuranceType?.includes("primary")) {
          console.log("Saving primary insurance front");
          dispatch(
            actionCreators.addPrimaryInsurance({
              ...state.data.primaryInsurance,
              insuranceCardFront: cloudinaryProcessedUrl,
            })
          );
          navigate("/kiosk/insurance_documents");
        } else {
          console.log("Saving secondary insurance front");
          dispatch(
            actionCreators.addSecondaryInsurance({
              ...state.data.secondaryInsurance,
              insuranceCardFront: cloudinaryProcessedUrl,
            })
          );
          navigate("/kiosk/insurance_docs_secondary");
        }
      } else if (id === "insuranceCardBack") {
        if (insuranceType?.includes("primary")) {
          console.log("Saving primary insurance back");
          dispatch(
            actionCreators.addPrimaryInsurance({
              ...state.data.primaryInsurance,
              insuranceCardBack: cloudinaryProcessedUrl,
            })
          );
          navigate("/kiosk/insurance_documents");
        } else {
          console.log("Saving secondary insurance back");
          dispatch(
            actionCreators.addSecondaryInsurance({
              ...state.data.secondaryInsurance,
              insuranceCardBack: cloudinaryProcessedUrl,
            })
          );
          navigate("/kiosk/insurance_docs_secondary");
        }
      } else {
        console.error("Unknown image type ID:", id);
      }
    } catch (error) {
      console.error("Error saving image:", error);
      setLoadingError("Failed to save image. Please try again.");
    }
  };

  const renderLoadingState = () => (
    <div className="camera-loading">
      <div className="spinner"></div>
      <p>Loading camera...</p>
    </div>
  );

  const renderErrorState = () => (
    <div className="camera-error">
      <div className="error-icon">⚠️</div>
      <p>{loadingError}</p>
      <button className="secondary-button" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );

  return (
    <div className="camera-container">
      <div className="camera-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <span>←</span>
        </button>
        <h2>{documentTitles[id] || "Take Photo"}</h2>
      </div>

      {loadingError ? (
        renderErrorState()
      ) : (
        <div className="camera-content">
          {/* Show guidelines when no image captured yet */}
          {!imgSrc && (
            <div className="camera-guidelines">
              <p>
                {documentGuidelines[id] || "Position properly and hold steady"}
              </p>
            </div>
          )}

          {/* Camera preview or captured image */}
          <div className="camera-preview">
            {!imgSrc ? (
              <>
                {loadingCV ? (
                  renderLoadingState()
                ) : (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      facingMode: cameraMode,
                      width: { ideal: 1280 },
                      height: { ideal: 720 },
                    }}
                    className="webcam"
                  />
                )}
              </>
            ) : (
              <div className="image-preview">
                {processing ? (
                  <div className="processing-overlay">
                    <div className="spinner"></div>
                    <p>Processing image...</p>
                  </div>
                ) : null}
                <img
                  src={processedImage || imgSrc}
                  alt="Captured"
                  className="captured-image"
                />
              </div>
            )}
          </div>

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Control buttons */}
          <div className="camera-controls">
            {!imgSrc ? (
              <>
                <button
                  className="control-button flip-button"
                  onClick={flipCamera}
                  disabled={loadingCV || !cvReady}
                >
                  <span>↺</span>
                </button>

                <button
                  className="control-button capture-button"
                  onClick={capture}
                  disabled={loadingCV || !cvReady}
                >
                  {loadingCV ? "Loading..." : "Capture"}
                </button>
              </>
            ) : (
              <>
                <button
                  className="control-button retake-button"
                  onClick={retakePhoto}
                  disabled={processing}
                >
                  Retake
                </button>

                <button
                  className="control-button use-button"
                  onClick={useImage}
                  disabled={processing}
                >
                  Use Image
                </button>
              </>
            )}
          </div>

          {/* Error message area */}
          <div id="cv-error" className="error-message"></div>
        </div>
      )}

      <style>
        {`
        .camera-container {
          display: flex;
          flex-direction: column;
          max-width: 100%;
          height: 100vh;
          background-color: #f5f5f7;
          color: #333;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        }

        .camera-header {
          display: flex;
          align-items: center;
          padding: 15px;
          background-color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 10;
        }

        .back-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          padding: 5px 15px;
          color: #2b73e8;
        }

        h2 {
          margin: 0 auto;
          font-size: 18px;
          font-weight: 500;
        }

        .camera-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          align-items: center;
          padding: 10px;
          position: relative;
        }

        .camera-guidelines {
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 8px;
          padding: 12px 15px;
          margin-bottom: 15px;
          text-align: center;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          max-width: 90%;
          z-index: 5;
        }

        .camera-preview {
          width: 100%;
          max-width: 640px;
          height: auto;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          position: relative;
          background-color: #000;
          aspect-ratio: 4/3;
          margin: 10px 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .webcam {
          width: 100%;
          height: auto;
          object-fit: cover;
        }

        .image-preview {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .captured-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .processing-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          z-index: 10;
        }

        .camera-controls {
          display: flex;
          justify-content: center;
          gap: 20px;
          padding: 20px 0;
          width: 100%;
        }

        .control-button {
          border: none;
          padding: 12px 20px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 120px;
        }

        .capture-button {
          background-color: #2b73e8;
          color: white;
          padding: 15px 30px;
        }

        .capture-button:hover {
          background-color: #1a5dc7;
        }

        .capture-button:disabled {
          background-color: #b2c9ec;
          cursor: not-allowed;
        }

        .flip-button {
          background-color: #f0f0f0;
          color: #333;
          font-size: 20px;
          min-width: 50px;
          padding: 10px;
        }

        .retake-button {
          background-color: #f0f0f0;
          color: #333;
        }

        .use-button {
          background-color: #34c759;
          color: white;
        }

        .use-button:hover {
          background-color: #2bb350;
        }

        .error-message {
          color: #e53935;
          margin-top: 10px;
          text-align: center;
        }

        .camera-loading,
        .camera-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 30px;
          text-align: center;
        }

        .error-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .secondary-button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #f0f0f0;
          border: none;
          border-radius: 50px;
          font-size: 16px;
          cursor: pointer;
        }

        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #2b73e8;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 600px) {
          .camera-preview {
            max-width: 100%;
          }

          .camera-controls {
            padding: 15px 0;
          }

          .control-button {
            padding: 10px 16px;
            font-size: 14px;
            min-width: 100px;
          }
        }
      `}
      </style>
    </div>
  );
};

export default Camera;
