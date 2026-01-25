/**
 * Cloudinary Service for Document Scanning & Enhancement
 * Handles auto-crop, straightening, and quality enhancement for:
 * - Patient portraits
 * - Driver's licenses
 * - Insurance cards
 * 
 * Uses only basic Cloudinary transformations (no premium add-ons required)
 */

import { Cloudinary } from "@cloudinary/url-gen";
import { fill, scale, limitFit } from "@cloudinary/url-gen/actions/resize";
import { autoGravity, focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { improve, sharpen, contrast, brightness, saturation } from "@cloudinary/url-gen/actions/adjust";
import { auto } from "@cloudinary/url-gen/qualifiers/quality";
import { auto as autoFormat } from "@cloudinary/url-gen/qualifiers/format";

// Initialize Cloudinary instance
const cld = new Cloudinary({
  cloud: { 
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "your-cloud-name" 
  }
});

/**
 * Upload image to Cloudinary
 * @param {string} base64Image - Base64 encoded image
 * @param {string} folder - Cloudinary folder name
 * @param {string} publicId - Optional custom public ID
 * @returns {Promise<Object>} Upload response with public_id
 */
export const uploadToCloudinary = async (base64Image, folder = "kiosk", publicId = null) => {
  try {
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "ml_default";
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "your-cloud-name";
    
    const formData = new FormData();
    formData.append("file", base64Image);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);
    
    if (publicId) {
      formData.append("public_id", publicId);
    }

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Image uploaded to Cloudinary:", data.public_id);
    
    return {
      publicId: data.public_id,
      secureUrl: data.secure_url,
      width: data.width,
      height: data.height,
    };
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    throw error;
  }
};

/**
 * Process portrait photo with face detection and enhancement
 * @param {string} publicId - Cloudinary public ID
 * @returns {string} Optimized image URL
 */
export const processPortraitPhoto = (publicId) => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "your-cloud-name";
  
  // Basic transformations for portrait:
  // 1. c_fill,g_face - Crop to face
  // 2. w_800,h_1000 - Standard size
  // 3. e_improve - Auto enhance
  // 4. q_auto:good - Auto quality
  // 5. f_auto - Auto format
  const transformations = [
    "c_fill,g_face,w_800,h_1000", // Crop to face with fixed dimensions
    "e_improve", // Auto improve colors
    "q_auto:good", // Auto quality
    "f_auto" // Auto format (webp, etc)
  ].join("/");
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

/**
 * Process driver's license with auto-crop, deskew, and enhancement
 * Uses Cloudinary AI-recommended settings for card/document scanning
 * Note: a_exif only handles EXIF-based rotation, not angled capture straightening
 * (Auto-straightening requires premium AI features)
 * @param {string} publicId - Cloudinary public ID
 * @returns {string} Optimized image URL
 */
export const processDriverLicense = (publicId) => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "your-cloud-name";
  
  // Cloudinary AI-recommended: c_fill scales to fill dimensions and crops excess
  // Provides tighter cropping around the card than c_auto
  // g_auto:subject focuses specifically on the main subject (card)
  const transformations = [
    "a_exif", // Auto-rotate based on EXIF orientation (not angled straightening)
    "c_fill,g_auto:subject,ar_16:10,w_1600", // Fill with AI subject detection for tighter crop
    "e_improve", // Auto color/brightness correction
    "e_sharpen:200", // Sharpen for text clarity
    "e_contrast:20", // Increase contrast for better readability
    "q_auto:best", // Best quality setting
    "f_auto" // Auto format (webp for better compression)
  ].join("/");
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

/**
 * Process insurance card with auto-crop, deskew, and enhancement
 * Uses Cloudinary AI-recommended settings for card/document scanning
 * Note: a_exif only handles EXIF-based rotation, not angled capture straightening
 * (Auto-straightening requires premium AI features)
 * @param {string} publicId - Cloudinary public ID
 * @returns {string} Optimized image URL
 */
export const processInsuranceCard = (publicId) => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "your-cloud-name";
  
  // Same AI-recommended transformation with tighter cropping
  const transformations = [
    "a_exif", // Auto-rotate based on EXIF
    "c_fill,g_auto:subject,ar_16:10,w_1400", // Fill with AI subject detection for tighter crop
    "e_improve", // Auto color correction
    "e_sharpen:200", // Sharpen text
    "e_contrast:20", // Increase contrast
    "q_auto:best", // Best quality
    "f_auto" // Auto format
  ].join("/");
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

/**
 * Upload and process portrait photo
 * @param {string} base64Image - Base64 encoded image
 * @param {string} patientId - Patient identifier for folder organization
 * @returns {Promise<Object>} Processed image URLs
 */
export const uploadAndProcessPortrait = async (base64Image, patientId) => {
  try {
    console.log("📤 Uploading portrait photo...");
    
    const uploaded = await uploadToCloudinary(
      base64Image,
      `kiosk/patients/${patientId}/portrait`,
      `portrait_${Date.now()}`
    );

    const processedUrl = processPortraitPhoto(uploaded.publicId);

    console.log("✅ Portrait processed:", processedUrl);

    return {
      publicId: uploaded.publicId,
      originalUrl: uploaded.secureUrl,
      processedUrl: processedUrl,
    };
  } catch (error) {
    console.error("❌ Error processing portrait:", error);
    throw error;
  }
};

/**
 * Upload and process driver's license
 * @param {string} base64Image - Base64 encoded image
 * @param {string} patientId - Patient identifier for folder organization
 * @param {string} side - 'front' or 'back'
 * @returns {Promise<Object>} Processed image URLs
 */
export const uploadAndProcessDriverLicense = async (base64Image, patientId, side = "front") => {
  try {
    console.log(`📤 Uploading driver's license (${side})...`);
    
    const uploaded = await uploadToCloudinary(
      base64Image,
      `kiosk/patients/${patientId}/license`,
      `license_${side}_${Date.now()}`
    );

    const processedUrl = processDriverLicense(uploaded.publicId);

    console.log(`✅ Driver's license (${side}) processed:`, processedUrl);

    return {
      publicId: uploaded.publicId,
      originalUrl: uploaded.secureUrl,
      processedUrl: processedUrl,
    };
  } catch (error) {
    console.error(`❌ Error processing driver's license (${side}):`, error);
    throw error;
  }
};

/**
 * Upload and process insurance card
 * @param {string} base64Image - Base64 encoded image
 * @param {string} patientId - Patient identifier for folder organization
 * @param {string} type - 'primary' or 'secondary'
 * @param {string} side - 'front' or 'back'
 * @returns {Promise<Object>} Processed image URLs
 */
export const uploadAndProcessInsuranceCard = async (base64Image, patientId, type = "primary", side = "front") => {
  try {
    console.log(`📤 Uploading ${type} insurance card (${side})...`);
    
    const uploaded = await uploadToCloudinary(
      base64Image,
      `kiosk/patients/${patientId}/insurance`,
      `insurance_${type}_${side}_${Date.now()}`
    );

    const processedUrl = processInsuranceCard(uploaded.publicId);

    console.log(`✅ ${type} insurance card (${side}) processed:`, processedUrl);

    return {
      publicId: uploaded.publicId,
      originalUrl: uploaded.secureUrl,
      processedUrl: processedUrl,
    };
  } catch (error) {
    console.error(`❌ Error processing ${type} insurance card (${side}):`, error);
    throw error;
  }
};

/**
 * Process image based on type
 * @param {string} base64Image - Base64 encoded image
 * @param {string} type - 'portrait', 'license', or 'insurance'
 * @param {Object} options - Additional options (patientId, side, insuranceType)
 * @returns {Promise<Object>} Processed image URLs
 */
export const processImage = async (base64Image, type, options = {}) => {
  const { patientId = "unknown", side = "front", insuranceType = "primary" } = options;

  switch (type) {
    case "portrait":
      return uploadAndProcessPortrait(base64Image, patientId);
    
    case "license":
      return uploadAndProcessDriverLicense(base64Image, patientId, side);
    
    case "insurance":
      return uploadAndProcessInsuranceCard(base64Image, patientId, insuranceType, side);
    
    default:
      throw new Error(`Unknown image type: ${type}`);
  }
};

export default {
  uploadToCloudinary,
  processPortraitPhoto,
  processDriverLicense,
  processInsuranceCard,
  uploadAndProcessPortrait,
  uploadAndProcessDriverLicense,
  uploadAndProcessInsuranceCard,
  processImage,
};
