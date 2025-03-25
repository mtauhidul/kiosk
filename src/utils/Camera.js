import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import FlipCameraIosIcon from "@mui/icons-material/FlipCameraIos";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import { bindActionCreators } from "redux";
import * as actionCreators from "../state/actionCreators/index";
import store from "../state/store";

const Camera = () => {
  const navigate = useNavigate();
  const insuranceType = window.sessionStorage.getItem("insuranceType");
  const [imgSrc, setImgSrc] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Face detection simulation interval reference
  const faceDetectionIntervalRef = useRef(null);

  const { id } = useParams();

  // Determine if we're taking a portrait or scanning a card
  const isPortrait = id === "patientsPicture";
  const isCard =
    id === "driversLicense" ||
    id === "insuranceCardFront" ||
    id === "insuranceCardBack";

  // Update window dimensions when resized
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // For cards, use the back camera by default
    if (isCard) {
      setFacingMode("environment");
    }

    // Simulate face detection for portraits
    if (isPortrait && !imgSrc) {
      startFaceDetectionSimulation();
    }

    // Handle cleanup when component unmounts
    return () => {
      if (webcamRef.current && webcamRef.current.stream) {
        const tracks = webcamRef.current.stream.getTracks();
        tracks.forEach((track) => track.stop());
      }

      // Clear face detection interval
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current);
      }
    };
  }, [isCard, isPortrait, imgSrc]);

  // Simulate face detection by occasionally changing detection state
  const startFaceDetectionSimulation = () => {
    // First detection after 1.5 seconds
    setTimeout(() => {
      setIsFaceDetected(true);
    }, 1500);

    // Then set up interval to simulate tracking
    faceDetectionIntervalRef.current = setInterval(() => {
      // Simulate face occasionally moving out of frame
      const outOfFrame = Math.random() > 0.9;
      if (outOfFrame) {
        setIsFaceDetected(false);

        // Then detect again after a short delay
        setTimeout(() => {
          setIsFaceDetected(true);
        }, 800);
      }
    }, 2000);
  };

  useEffect(() => {
    if (processedImage) {
      updateState(processedImage);
    }
  }, [processedImage]);

  useEffect(() => {
    if (data && imgSrc) {
      if (id === "patientsPicture" || id === "driversLicense") {
        addDemographicData(data);
        navigate("/kiosk/demographics_documents");
      } else if (id === "insuranceCardFront" || id === "insuranceCardBack") {
        if (insuranceType && insuranceType.includes("primary")) {
          addPrimaryInsurance(data);
          navigate("/kiosk/insurance_documents");
        } else if (insuranceType && insuranceType.includes("secondary")) {
          addSecondaryInsurance(data);
          navigate("/kiosk/insurance_docs_secondary");
        }
      }
    }
  }, [data]);

  const { addDemographicData } = bindActionCreators(actionCreators, dispatch);
  const { addPrimaryInsurance } = bindActionCreators(actionCreators, dispatch);
  const { addSecondaryInsurance } = bindActionCreators(
    actionCreators,
    dispatch
  );

  // Adjust video constraints based on device orientation and type
  const videoConstraints = {
    width: {
      ideal: windowDimensions.width > windowDimensions.height ? 1280 : 720,
    },
    height: {
      ideal: windowDimensions.width > windowDimensions.height ? 720 : 1280,
    },
    facingMode: facingMode,
  };

  // Toggle camera facing mode
  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
    setIsFaceDetected(false); // Reset face detection when camera changes

    // Restart face detection simulation
    if (faceDetectionIntervalRef.current) {
      clearInterval(faceDetectionIntervalRef.current);
    }
    setTimeout(() => {
      startFaceDetectionSimulation();
    }, 500);
  };

  const updateState = (capturedImg) => {
    if (id === "patientsPicture") {
      const state = store?.getState()?.data?.demographicsInfo;
      const newState = { ...state, patientsPicture: capturedImg };
      setData(newState);
    } else if (id === "driversLicense") {
      const state = store?.getState()?.data?.demographicsInfo;
      const newState = { ...state, driversLicense: capturedImg };
      setData(newState);
    } else if (id === "insuranceCardFront") {
      if (insuranceType && insuranceType.includes("primary")) {
        const state = store?.getState()?.data?.primaryInsurance;
        const newState = { ...state, insuranceCardFront: capturedImg };
        setData(newState);
      } else if (insuranceType && insuranceType.includes("secondary")) {
        const state = store?.getState()?.data?.secondaryInsurance;
        const newState = { ...state, insuranceCardFront: capturedImg };
        setData(newState);
      }
    } else if (id === "insuranceCardBack") {
      if (insuranceType && insuranceType.includes("primary")) {
        const state = store?.getState()?.data?.primaryInsurance;
        const newState = { ...state, insuranceCardBack: capturedImg };
        setData(newState);
      } else if (insuranceType && insuranceType.includes("secondary")) {
        const state = store?.getState()?.data?.secondaryInsurance;
        const newState = { ...state, insuranceCardBack: capturedImg };
        setData(newState);
      }
    }
  };

  const capture = () => {
    if (webcamRef.current) {
      setIsProcessing(true);
      const capture = webcamRef.current.getScreenshot();
      setImgSrc(capture);
      processImage(capture);

      // Clear face detection interval on capture
      if (faceDetectionIntervalRef.current) {
        clearInterval(faceDetectionIntervalRef.current);
      }
    }
  };

  const processImage = (imageSrc) => {
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0, img.width, img.height);

      if (isPortrait) {
        // For portrait, process as passport-style photo
        processPortrait(ctx, img, canvas);
      } else {
        // For cards, detect edges and crop to the card
        processCard(ctx, img, canvas);
      }
    };
  };

  const processPortrait = (ctx, img, canvas) => {
    const width = img.width;
    const height = img.height;

    // For passport-style portrait photo - using 3:4 (width:height) ratio
    // Center point for face detection (middle of frame horizontally)
    const centerX = width / 2;
    const centerY = height * 0.5; // Centered vertically (we'll adjust the crop area)

    // Calculate dimensions that ensure proper head space in all directions
    // Using standard passport photo proportions but ensuring we don't cut off the head

    // Width should be about 70-80% of the face width plus margins
    const cropHeight = height * 0.65; // Taller to include full head
    const cropWidth = cropHeight * 0.75; // Width about 75% of height

    // Calculate crop coordinates
    // CRITICAL FIX: Ensure we leave enough space above the head
    // Move the crop area up to include the whole head
    const cropX = centerX - cropWidth / 2; // Centered horizontally
    const cropY = centerY - cropHeight * 0.6; // Key change: start higher to avoid cutting off head

    // Create a new canvas for the final processed image
    const finalCanvas = document.createElement("canvas");
    // Standard passport-style dimensions (3:4 ratio)
    const finalWidth = 300; // Width
    const finalHeight = 400; // Height

    finalCanvas.width = finalWidth;
    finalCanvas.height = finalHeight;
    const finalCtx = finalCanvas.getContext("2d");

    // Fill with light gray background
    finalCtx.fillStyle = "#F0F0F0";
    finalCtx.fillRect(0, 0, finalWidth, finalHeight);

    // Draw the cropped image centered on the background
    finalCtx.drawImage(
      img,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      finalWidth,
      finalHeight
    );

    // Apply subtle enhancements for passport-style look
    finalCtx.filter = "contrast(1.05) brightness(1.02)";
    finalCtx.drawImage(finalCanvas, 0, 0);
    finalCtx.filter = "none";

    // Convert to base64 with high quality
    const processedImage = finalCanvas.toDataURL("image/jpeg", 0.95);
    setProcessedImage(processedImage);
    setIsProcessing(false);
  };

  const processCard = (ctx, img, canvas) => {
    const width = img.width;
    const height = img.height;

    // Improved crop dimensions for cards - modified to better match the guide frame
    // These values are adjusted to correctly crop the card based on the new guide proportions
    const cropX = width * 0.15; // 15% from left (reduced from sides)
    const cropY = height * 0.25; // 25% from top (increased to get more height)
    const cropWidth = width * 0.7; // 70% of width (narrower to match guide)
    const cropHeight = height * 0.5; // 50% of height (taller)

    // Create a new canvas for the cropped image
    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = cropWidth;
    cropCanvas.height = cropHeight;
    const cropCtx = cropCanvas.getContext("2d");

    // Enable image smoothing for better quality
    cropCtx.imageSmoothingEnabled = true;
    cropCtx.imageSmoothingQuality = "high";

    // Draw cropped region
    cropCtx.drawImage(
      img,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    // Apply enhancements for card images
    // Add sharpening and contrast for better readability of card details
    cropCtx.filter = "contrast(1.15) brightness(1.05)";
    cropCtx.drawImage(cropCanvas, 0, 0);
    cropCtx.filter = "none";

    // Add subtle border
    cropCtx.strokeStyle = "rgba(210, 210, 210, 0.5)";
    cropCtx.lineWidth = 2;
    cropCtx.strokeRect(0, 0, cropWidth, cropHeight);

    // Convert to base64
    const croppedImage = cropCanvas.toDataURL("image/jpeg", 0.95);
    setProcessedImage(croppedImage);
    setIsProcessing(false);
  };

  const retake = () => {
    setImgSrc(null);
    setProcessedImage(null);
    setData(null);
    setIsFaceDetected(false);

    // Restart face detection simulation
    startFaceDetectionSimulation();
  };

  // Calculate guide dimensions for passport-style photo
  const getPortraitGuideDimensions = () => {
    const isMobile = windowDimensions.width < 768;

    // Use a consistent aspect ratio that shows the head properly
    // Width to height ratio of approximately 3:4
    const widthPercent = isMobile ? 40 : 35; // Reasonable width
    const heightPercent = isMobile ? 55 : 47; // Height that ensures head space

    return { widthPercent, heightPercent };
  };

  // Calculate guide dimensions for card scanning
  // NEW FUNCTION: Get the proper dimensions for card scanning guide
  const getCardGuideDimensions = () => {
    const isMobile = windowDimensions.width < 768;
    const isLandscape = windowDimensions.width > windowDimensions.height;

    // Standard credit/insurance card has roughly 1.6:1 width to height ratio
    // We'll adjust the guide to match this ratio

    // Base values that maintain proper card aspect ratio
    let widthPercent = isMobile ? 75 : 65;
    let heightPercent = widthPercent / 1.6; // Card aspect ratio (width:height ≈ 1.6:1)

    // Adjust for screen orientation
    if (isLandscape) {
      // In landscape, we want to make sure height fits well in viewport
      heightPercent = isMobile ? 38 : 30;
      widthPercent = heightPercent * 1.6; // Maintain aspect ratio
    }

    return { widthPercent, heightPercent };
  };

  const { widthPercent, heightPercent } = isPortrait
    ? getPortraitGuideDimensions()
    : getCardGuideDimensions();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1000,
        bgcolor: "black",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Header with improved visibility */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          padding: "16px",
          zIndex: 1001,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              color: "white",
              background: "rgba(0,0,0,0.3)",
              "&:hover": { background: "rgba(0,0,0,0.5)" },
            }}
          >
            <CloseIcon fontSize="medium" />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              ml: 2,
              fontWeight: 500,
              textShadow: "0px 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            {isPortrait
              ? "Take Passport Photo"
              : `Scan ${
                  id === "driversLicense" ? "ID Card" : "Insurance Card"
                }`}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!imgSrc ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />

            {/* Guide frame with face position indicators */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              {isPortrait ? (
                // Improved guide with head positioning help
                <Box
                  sx={{
                    width: `${widthPercent}%`,
                    height: `${heightPercent}%`,
                    border: `3px ${isFaceDetected ? "solid" : "dashed"} ${
                      isFaceDetected ? "rgba(77, 189, 116, 1)" : "white"
                    }`,
                    borderRadius: "8px",
                    opacity: 0.9,
                    position: "relative",
                    boxShadow: isFaceDetected
                      ? "0 0 10px rgba(77, 189, 116, 0.6)"
                      : "none",
                    transition: "all 0.3s ease",
                    transform: "translateY(-8%)", // Move up slightly to match proper head position
                    backgroundColor: "transparent",
                    margin: "0 auto",
                  }}
                >
                  {/* Head positioning guide markers */}
                  {isFaceDetected && (
                    <>
                      {/* Top line showing where top of head should be */}
                      <Box
                        sx={{
                          position: "absolute",
                          width: "40%",
                          height: "1px",
                          backgroundColor: "rgba(255, 255, 255, 0.5)",
                          top: "20%",
                          left: "30%",
                        }}
                      />
                      {/* Eye line guide */}
                      <Box
                        sx={{
                          position: "absolute",
                          width: "40%",
                          height: "1px",
                          backgroundColor: "rgba(255, 255, 255, 0.5)",
                          top: "45%",
                          left: "30%",
                        }}
                      />
                    </>
                  )}
                </Box>
              ) : (
                // IMPROVED: Card guide frame with better aspect ratio matching standard cards
                <Box
                  sx={{
                    width: `${widthPercent}%`,
                    height: `${heightPercent}%`,
                    border: "3px dashed rgba(255, 255, 255, 0.8)",
                    borderRadius: "8px",
                    opacity: 0.85,
                    position: "relative",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    // Guide corners to help with alignment
                    "&::before, &::after, & > div::before, & > div::after": {
                      content: '""',
                      position: "absolute",
                      width: "15px",
                      height: "15px",
                      borderColor: "rgba(255, 255, 255, 0.9)",
                      borderStyle: "solid",
                      borderWidth: 0,
                    },
                  }}
                >
                  {/* Corner guides */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "15px",
                      height: "15px",
                      borderTop: "3px solid rgba(255, 255, 255, 0.9)",
                      borderLeft: "3px solid rgba(255, 255, 255, 0.9)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "15px",
                      height: "15px",
                      borderTop: "3px solid rgba(255, 255, 255, 0.9)",
                      borderRight: "3px solid rgba(255, 255, 255, 0.9)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "15px",
                      height: "15px",
                      borderBottom: "3px solid rgba(255, 255, 255, 0.9)",
                      borderLeft: "3px solid rgba(255, 255, 255, 0.9)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: "15px",
                      height: "15px",
                      borderBottom: "3px solid rgba(255, 255, 255, 0.9)",
                      borderRight: "3px solid rgba(255, 255, 255, 0.9)",
                    }}
                  />
                </Box>
              )}
            </Box>
          </>
        ) : (
          // Improved preview display
          <Box
            sx={{
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#111",
              padding: "20px",
            }}
          >
            <Box
              sx={{
                width: "auto",
                height: "auto",
                maxWidth: "90%",
                maxHeight: "80%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              <img
                src={processedImage || imgSrc}
                alt="Captured"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Box>
        )}

        {/* Better guidance instructions */}
        {!imgSrc && isPortrait && (
          <Box
            sx={{
              position: "absolute",
              bottom: isFaceDetected ? 150 : 140,
              left: "50%",
              transform: "translateX(-50%)",
              width: "90%",
              maxWidth: "400px",
              backgroundColor: isFaceDetected
                ? "rgba(77, 189, 116, 0.8)"
                : "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "24px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              transition: "background-color 0.3s ease",
              zIndex: 5,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {isFaceDetected
                ? "Good! Keep entire head inside the frame"
                : "Position your full head within the frame"}
            </Typography>
          </Box>
        )}

        {/* IMPROVED: Card guidance with more specific instructions */}
        {!imgSrc && isCard && (
          <Box
            sx={{
              position: "absolute",
              bottom: 140,
              left: "50%",
              transform: "translateX(-50%)",
              width: "90%",
              maxWidth: "400px",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "24px",
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              zIndex: 5,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {id.includes("insurance")
                ? "Position entire insurance card within frame"
                : "Position ID card within frame and ensure details are visible"}
            </Typography>
          </Box>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Bottom controls */}
        <Box
          sx={{
            position: "absolute",
            bottom: 30,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            gap: 3,
            zIndex: 10,
          }}
        >
          {!imgSrc ? (
            <>
              {/* Camera flip button */}
              <IconButton
                onClick={toggleCamera}
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
                  padding: "12px",
                }}
              >
                <FlipCameraIosIcon fontSize="medium" />
              </IconButton>

              {/* Capture button */}
              <Button
                onClick={capture}
                variant="contained"
                disabled={isProcessing || (isPortrait && !isFaceDetected)}
                sx={{
                  borderRadius: "50%",
                  minWidth: 80,
                  width: 80,
                  height: 80,
                  backgroundColor: isFaceDetected
                    ? "rgb(77, 189, 116)"
                    : "white",
                  "&:hover": {
                    backgroundColor: isFaceDetected
                      ? "rgb(63, 170, 100)"
                      : "white",
                  },
                  boxShadow: "0 3px 12px rgba(0,0,0,0.4)",
                  border: "none",
                  "&::before, &::after": {
                    display: "none",
                  },
                }}
              >
                {isProcessing ? (
                  <CircularProgress size={34} />
                ) : (
                  <CameraAltIcon
                    sx={{
                      fontSize: 36,
                      color: isFaceDetected ? "white" : "#1976d2",
                    }}
                  />
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={retake}
                variant="outlined"
                startIcon={<ReplayIcon />}
                sx={{
                  borderRadius: 28,
                  color: "white",
                  borderColor: "white",
                  padding: "10px 20px",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Retake
              </Button>

              <Button
                onClick={() => updateState(processedImage || imgSrc)}
                variant="contained"
                startIcon={<CheckIcon />}
                sx={{
                  borderRadius: 28,
                  padding: "10px 24px",
                  backgroundColor: "rgb(77, 189, 116)",
                  "&:hover": {
                    backgroundColor: "rgb(63, 170, 100)",
                  },
                }}
                disabled={!processedImage && !imgSrc}
              >
                Use Photo
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Camera;
