import CameraIcon from "@mui/icons-material/Camera";
import CloseIcon from "@mui/icons-material/Close";
import FlipCameraIcon from "@mui/icons-material/FlipCameraIos";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Webcam from "react-webcam";
import * as actionCreators from "../../state/actionCreators/index";
import styles from "../../styles/ScanCard.module.css";

// OpenCV utility class for image processing
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
            window.cv.data.haarcascade_frontalface_default,
          );
          resolve(window.faceCascadeClassifier);
          return;
        }

        // Fallback: Load the classifier asynchronously
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
                  false,
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
                "Error loading cascade classifier: " + err.message,
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

const ScanCard = ({ id, title, subTitle, img, alt, btnText }) => {
  const dispatch = useDispatch();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Get the current data from Redux store to always have the latest image
  const state = useSelector((state) => state.data);
  const demographicsInfo = state.demographicsInfo || {};
  const primaryInsurance = state.primaryInsurance || {};
  const secondaryInsurance = state.secondaryInsurance || {};

  // Get the appropriate image based on ID
  const getImageFromState = () => {
    switch (id) {
      case "patientsPicture":
        return demographicsInfo.patientsPicture;
      case "driversLicense":
        return demographicsInfo.driversLicense;
      case "insuranceCardFront":
        return primaryInsurance.insuranceCardFront;
      case "insuranceCardBack":
        return primaryInsurance.insuranceCardBack;
      case "secInsuranceFront":
        return secondaryInsurance.insuranceCardFront;
      case "secInsuranceBack":
        return secondaryInsurance.insuranceCardBack;
      default:
        return null;
    }
  };

  // State variables
  const [currentImage, setCurrentImage] = useState(getImageFromState() || img);
  const [openCamera, setOpenCamera] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [cvReady, setCvReady] = useState(false);
  const [loadingCV, setLoadingCV] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [cameraMode, setCameraMode] = useState(
    id === "patientsPicture" ? "user" : "environment",
  );

  // Update currentImage whenever the state changes
  useEffect(() => {
    const stateImage = getImageFromState();
    setCurrentImage(stateImage || img);
  }, [
    demographicsInfo,
    primaryInsurance,
    secondaryInsurance,
    img,
    getImageFromState,
  ]);

  // Determine document type
  const isPortrait = id === "patientsPicture";
  const isCard = [
    "driversLicense",
    "insuranceCardFront",
    "insuranceCardBack",
    "secInsuranceFront",
    "secInsuranceBack",
  ].includes(id);

  // Document titles for user guidance
  const documentTitles = {
    patientsPicture: "Take your portrait photo",
    driversLicense: "Scan your driver's license",
    insuranceCardFront: "Scan the front of your primary insurance card",
    insuranceCardBack: "Scan the back of your primary insurance card",
    secInsuranceFront: "Scan the front of your secondary insurance card",
    secInsuranceBack: "Scan the back of your secondary insurance card",
  };

  // Guidelines/tips to show the user
  const documentGuidelines = {
    patientsPicture:
      "Center your face in the frame and look directly at the camera",
    driversLicense: "Place the entire license within the frame and hold steady",
    insuranceCardFront: "Make sure all text on the front is clearly visible",
    insuranceCardBack: "Make sure all text on the back is clearly visible",
    secInsuranceFront: "Make sure all text on the front is clearly visible",
    secInsuranceBack: "Make sure all text on the back is clearly visible",
  };

  // Load OpenCV when camera is opened
  useEffect(() => {
    if (!openCamera) return;

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
            "Failed to load image processing library. Please try again later.",
          );
          setLoadingCV(false);
        };

        document.body.appendChild(script);
      } catch (error) {
        setLoadingError(
          `Error loading image processing library: ${error.message}`,
        );
        setLoadingCV(false);
      }
    };

    loadOpenCV();
  }, [openCamera]);

  const openCameraDialog = () => {
    setOpenCamera(true);
    setImgSrc(null);
    setProcessedImage(null);
    setLoadingError(null);
  };

  const closeCameraDialog = () => {
    setOpenCamera(false);
    setImgSrc(null);
    setProcessedImage(null);
  };

  const capture = async () => {
    if (!webcamRef.current) return;

    try {
      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) {
        setLoadingError(
          "Failed to capture image. Please ensure camera access is granted.",
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

          const ctx = canvas.getContext("2d", { alpha: false });
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0);

          try {
            if (isPortrait) {
              await processPortrait(canvas);
            } else if (isCard) {
              await processCard(canvas);
            } else {
              setProcessedImage(canvas.toDataURL("image/jpeg", 0.98));
            }
            resolve();
          } catch (error) {
            setProcessedImage(canvas.toDataURL("image/jpeg", 0.98));
            console.error("Image processing error:", error);
            resolve();
          }
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
      setProcessedImage(canvas.toDataURL("image/jpeg", 0.98));
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
          cv.CHAIN_APPROX_SIMPLE,
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

        if (bestRect) {
          // Add padding around the detected card (10% on each side)
          const padding = 0.1;
          const paddedX = Math.max(0, bestRect.x - bestRect.width * padding);
          const paddedY = Math.max(0, bestRect.y - bestRect.height * padding);
          const paddedWidth = Math.min(
            bestRect.width * (1 + 2 * padding),
            src.cols - paddedX,
          );
          const paddedHeight = Math.min(
            bestRect.height * (1 + 2 * padding),
            src.rows - paddedY,
          );

          const paddedRect = new cv.Rect(
            Math.floor(paddedX),
            Math.floor(paddedY),
            Math.floor(paddedWidth),
            Math.floor(paddedHeight),
          );

          const cropped = src.roi(paddedRect);
          const outCanvas = document.createElement("canvas");
          outCanvas.width = paddedRect.width;
          outCanvas.height = paddedRect.height;
          cv.imshow(outCanvas, cropped);

          const result = outCanvas.toDataURL("image/jpeg", 0.98);
          setProcessedImage(result);

          cropped.delete();
        } else {
          setProcessedImage(canvas.toDataURL("image/jpeg", 0.98));
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
      setProcessedImage(canvas.toDataURL("image/jpeg", 0.98));
    }
  };

  const processPortrait = async (canvas) => {
    if (!cvReady || !window.cv) {
      setProcessedImage(canvas.toDataURL("image/jpeg", 0.98));
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

              if (faces.size() > 0) {
                const face = faces.get(0);
                const faceWidth = face.width;
                const faceHeight = face.height;
                const faceCenterX = face.x + faceWidth / 2;
                const faceCenterY = face.y + faceHeight / 2;

                const targetAspectRatio = 3 / 4;
                const portraitWidth = faceWidth * 4;
                const portraitHeight = portraitWidth / targetAspectRatio;

                const cropX = Math.max(faceCenterX - portraitWidth / 2, 0);
                const cropY = Math.max(faceCenterY - portraitHeight * 0.25, 0);
                const cropW = Math.min(portraitWidth, src.cols - cropX);
                const cropH = Math.min(portraitHeight, src.rows - cropY);

                const outCanvas = document.createElement("canvas");
                const ctx = outCanvas.getContext("2d", { alpha: false });
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";

                const sourceAspect = cropW / cropH;
                const targetAspect = 3 / 4;

                let finalWidth, finalHeight;

                if (sourceAspect > targetAspect) {
                  finalHeight = 800;
                  finalWidth = finalHeight * sourceAspect;
                } else {
                  finalWidth = 600;
                  finalHeight = finalWidth / sourceAspect;
                }

                outCanvas.width = finalWidth;
                outCanvas.height = finalHeight;

                ctx.drawImage(
                  canvas,
                  cropX,
                  cropY,
                  cropW,
                  cropH,
                  0,
                  0,
                  finalWidth,
                  finalHeight,
                );

                const result = outCanvas.toDataURL("image/jpeg", 0.98);
                setProcessedImage(result);
              } else {
                setProcessedImage(canvas.toDataURL("image/jpeg", 0.98));
              }
            } finally {
              // Clean up
              if (faces) faces.delete();
            }
          } else {
            setProcessedImage(canvas.toDataURL("image/jpeg", 0.98));
          }
        } catch (faceError) {
          console.error("Face detection setup error:", faceError);
          setProcessedImage(canvas.toDataURL("image/jpeg", 0.98));
        }
      } finally {
        // Clean up OpenCV resources
        src.delete();
        gray.delete();
      }
    } catch (error) {
      console.error("Error in portrait processing:", error);
      setProcessedImage(canvas.toDataURL("image/jpeg", 0.98));
    }
  };

  const flipCamera = () => {
    setCameraMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const retakePhoto = () => {
    setImgSrc(null);
    setProcessedImage(null);
  };

  const saveImage = () => {
    if (!processedImage && !imgSrc) {
      console.log("No image captured");
      return;
    }

    const finalImage = processedImage || imgSrc;

    console.log("Saving image for:", id);

    try {
      // Update state based on the ID parameter
      if (id === "patientsPicture") {
        dispatch(
          actionCreators.addDemographicData({
            ...demographicsInfo,
            patientsPicture: finalImage,
          }),
        );
      } else if (id === "driversLicense") {
        dispatch(
          actionCreators.addDemographicData({
            ...demographicsInfo,
            driversLicense: finalImage,
          }),
        );
      } else if (id === "insuranceCardFront") {
        // Primary insurance front
        dispatch(
          actionCreators.addPrimaryInsurance({
            ...primaryInsurance,
            insuranceCardFront: finalImage,
          }),
        );
      } else if (id === "insuranceCardBack") {
        // Primary insurance back
        dispatch(
          actionCreators.addPrimaryInsurance({
            ...primaryInsurance,
            insuranceCardBack: finalImage,
          }),
        );
      } else if (id === "secInsuranceFront") {
        // Secondary insurance front
        dispatch(
          actionCreators.addSecondaryInsurance({
            ...secondaryInsurance,
            insuranceCardFront: finalImage,
          }),
        );
      } else if (id === "secInsuranceBack") {
        // Secondary insurance back
        dispatch(
          actionCreators.addSecondaryInsurance({
            ...secondaryInsurance,
            insuranceCardBack: finalImage,
          }),
        );
      } else {
        console.error("Unknown image type ID:", id);
      }

      // Update local state to reflect the change immediately
      setCurrentImage(finalImage);

      // Close the camera dialog after saving
      setOpenCamera(false);
    } catch (error) {
      console.error("Error saving image:", error);
      setLoadingError("Failed to save image. Please try again.");
    }
  };

  const renderLoadingState = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        p: 3,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "4px solid rgba(0, 0, 0, 0.1)",
          borderTop: "4px solid #2b73e8",
          animation: "spin 1s linear infinite",
          mb: 2,
        }}
      />
      <Typography>Loading camera...</Typography>
    </Box>
  );

  const renderErrorState = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        ⚠️
      </Typography>
      <Typography sx={{ mb: 2 }}>{loadingError}</Typography>
      <Button variant="outlined" onClick={closeCameraDialog}>
        Close
      </Button>
    </Box>
  );

  return (
    <>
      <Card
        sx={{
          width: 240,
          height: "auto",
          pb: "16px",
          textAlign: "center",
          borderRadius: "12px",
        }}
      >
        <CardHeader subheader={title} />
        <h6 style={{ marginTop: "-15px" }} className="header6">
          {subTitle}
        </h6>
        <div className={styles.cardImg}>
          <img
            src={currentImage}
            alt={alt}
            style={{
              borderRadius: "12px",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <Button
          onClick={openCameraDialog}
          id={styles.violateText}
          variant="contained"
          size="medium"
          className="backHomeButton"
        >
          {btnText}
        </Button>
      </Card>

      <Dialog
        open={openCamera}
        onClose={closeCameraDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            height: "80vh",
            maxHeight: "600px",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography variant="h6" sx={{ flex: 1 }}>
            {documentTitles[id] || "Take Photo"}
          </Typography>
          <IconButton onClick={closeCameraDialog}>
            <CloseIcon />
          </IconButton>
        </Box>

        {loadingError ? (
          renderErrorState()
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              p: 2,
              overflow: "hidden",
            }}
          >
            {/* Guidelines */}
            {!imgSrc && (
              <Box
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  p: 1.5,
                  borderRadius: "12px",
                  mb: 2,
                  textAlign: "center",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography>
                  {documentGuidelines[id] ||
                    "Position properly and hold steady"}
                </Typography>
              </Box>
            )}

            {/* Camera preview or captured image */}
            <Box
              sx={{
                flex: 1,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                bgcolor: "#000",
                borderRadius: "12px",
                mb: 2,
              }}
            >
              {!imgSrc ? (
                <>
                  {loadingCV ? (
                    renderLoadingState()
                  ) : (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      screenshotQuality={1}
                      videoConstraints={{
                        facingMode: cameraMode,
                        width: { ideal: 1920, min: 1280 },
                        height: { ideal: 1080, min: 720 },
                        aspectRatio: isPortrait ? 0.75 : 1.586,
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "12px",
                      }}
                    />
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  {processing && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                        zIndex: 10,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          border: "4px solid rgba(255, 255, 255, 0.2)",
                          borderTop: "4px solid #fff",
                          animation: "spin 1s linear infinite",
                          mb: 2,
                        }}
                      />
                      <Typography>Processing image...</Typography>
                    </Box>
                  )}
                  <img
                    src={processedImage || imgSrc}
                    alt="Captured"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "12px",
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Control buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                p: 2,
              }}
            >
              {!imgSrc ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={flipCamera}
                    disabled={loadingCV || !cvReady}
                    startIcon={<FlipCameraIcon />}
                  >
                    Flip
                  </Button>

                  <Button
                    variant="contained"
                    onClick={capture}
                    disabled={loadingCV || !cvReady}
                    startIcon={<CameraIcon />}
                  >
                    {loadingCV ? "Loading..." : "Capture"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    onClick={retakePhoto}
                    disabled={processing}
                  >
                    Retake
                  </Button>

                  <Button
                    variant="contained"
                    color="success"
                    onClick={saveImage}
                    disabled={processing}
                  >
                    Save
                  </Button>
                </>
              )}
            </Box>

            {/* Error message area */}
            <Box
              id="cv-error"
              sx={{ color: "error.main", textAlign: "center" }}
            ></Box>
          </Box>
        )}

        <style jsx="true">{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </Dialog>
    </>
  );
};

export default ScanCard;
