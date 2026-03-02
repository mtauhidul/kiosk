/**
 * Cloudinary Service for Document Scanning & Enhancement
 * Handles auto-crop, straightening, and quality enhancement for:
 * - Patient portraits
 * - Driver's licenses
 * - Insurance cards
 *
 * Card isolation strategy (free tier):
 *   - e_trim:<tolerance>  → trims pixels whose color matches the corner pixels
 *                           (i.e. removes the table/surface background)
 *   - c_fit               → scales to fit without cropping any card content
 *   - enhancement chain   → improve + sharpen + contrast
 *
 * NOTE: Cloudinary does NOT offer free-tier perspective correction / deskew.
 * e_trim is the closest free equivalent to "card detection & crop".
 * g_auto:subject is NOT a valid qualifier and falls back silently to center;
 * it has been removed from all card pipelines.
 */

const cloudName =
  process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || "your-cloud-name";
const uploadPreset =
  process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || "ml_default";

// ---------------------------------------------------------------------------
// Upload helper
// ---------------------------------------------------------------------------

/**
 * Upload raw image to Cloudinary.
 * Transformations are applied on-demand via URL (processDriverLicense, etc.).
 * @param {string} base64Image
 * @param {string} folder
 * @param {string|null} publicId
 * @returns {Promise<{publicId, secureUrl, width, height}>}
 */
export const uploadToCloudinary = async (
  base64Image,
  folder = "kiosk",
  publicId = null
) => {
  try {
    const formData = new FormData();
    formData.append("file", base64Image);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    if (publicId) formData.append("public_id", publicId);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Upload failed: ${response.statusText} — ${errBody}`);
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

// ---------------------------------------------------------------------------
// Transformation URL builders
// ---------------------------------------------------------------------------

/**
 * Portrait photo: face-detected crop, enhance, auto quality.
 */
export const processPortraitPhoto = (publicId) => {
  const transformations = [
    "c_fill,g_face,w_800,h_1000", // crop tightly to face
    "e_improve",                   // auto color/brightness
    "q_auto:good",
    "f_auto",
  ].join("/");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

/**
 * Driver's license:
 *  1. e_trim:15  – remove background by corner-pixel color similarity (the
 *                  closest free-tier equivalent to "card edge detection")
 *  2. c_fit,w_1600 – scale to max 1600 px wide WITHOUT cropping any card content
 *  3. Enhancement chain for text readability
 */
export const processDriverLicense = (publicId) => {
  const transformations = [
    "a_exif",                        // honour device EXIF rotation
    "e_trim:15",                     // isolate card from background surface
    "c_fit,w_1600",                  // fit (never crop) at full resolution
    "e_improve",                     // auto colour correction
    "e_sharpen:200",                 // sharpen for text clarity
    "e_contrast:25",                 // boost contrast for readability
    "e_unsharp_mask:100",            // additional micro-detail sharpening
    "q_auto:best",
    "f_auto",
  ].join("/");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

/**
 * Insurance card – same pipeline as driver's license, slightly smaller output.
 */
export const processInsuranceCard = (publicId) => {
  const transformations = [
    "a_exif",
    "e_trim:15",
    "c_fit,w_1400",
    "e_improve",
    "e_sharpen:200",
    "e_contrast:25",
    "e_unsharp_mask:100",
    "q_auto:best",
    "f_auto",
  ].join("/");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

// ---------------------------------------------------------------------------
// Upload + process helpers
// ---------------------------------------------------------------------------

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
      processedUrl,
    };
  } catch (error) {
    console.error("❌ Error processing portrait:", error);
    throw error;
  }
};

export const uploadAndProcessDriverLicense = async (
  base64Image,
  patientId,
  side = "front"
) => {
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
      processedUrl,
    };
  } catch (error) {
    console.error(`❌ Error processing driver's license (${side}):`, error);
    throw error;
  }
};

export const uploadAndProcessInsuranceCard = async (
  base64Image,
  patientId,
  type = "primary",
  side = "front"
) => {
  try {
    console.log(`📤 Uploading ${type} insurance card (${side})...`);

    const uploaded = await uploadToCloudinary(
      base64Image,
      `kiosk/patients/${patientId}/insurance`,
      `insurance_${type}_${side}_${Date.now()}`
    );

    const processedUrl = processInsuranceCard(uploaded.publicId);

    console.log(
      `✅ ${type} insurance card (${side}) processed:`,
      processedUrl
    );

    return {
      publicId: uploaded.publicId,
      originalUrl: uploaded.secureUrl,
      processedUrl,
    };
  } catch (error) {
    console.error(
      `❌ Error processing ${type} insurance card (${side}):`,
      error
    );
    throw error;
  }
};

// ---------------------------------------------------------------------------
// Generic entry-point used by Camera.js and ScanCard.jsx
// ---------------------------------------------------------------------------

/**
 * Process image based on type
 * @param {string} base64Image
 * @param {string} type - 'portrait' | 'license' | 'insurance'
 * @param {Object} options - { patientId, side, insuranceType }
 */
export const processImage = async (base64Image, type, options = {}) => {
  const {
    patientId = "unknown",
    side = "front",
    insuranceType = "primary",
  } = options;

  switch (type) {
    case "portrait":
      return uploadAndProcessPortrait(base64Image, patientId);
    case "license":
      return uploadAndProcessDriverLicense(base64Image, patientId, side);
    case "insurance":
      return uploadAndProcessInsuranceCard(
        base64Image,
        patientId,
        insuranceType,
        side
      );
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

