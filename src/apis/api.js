import axios from "axios";

// Set the base URL for the API
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5001/api";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Check if patient has appointment using encounter ID
 * @param {string} encounterId - Encounter ID to match with existing appointment
 * @returns {Promise} - API response
 */
export const checkAppointment = async (encounterId) => {
  try {
    const response = await api.post("/kiosk/check-in", { encounterId });

    if (response.data.success) {
      return {
        status: "success",
        data: response.data.data,
      };
    } else {
      return {
        status: "error",
        message: response.data.message || "No appointment found",
      };
    }
  } catch (error) {
    console.error("Error checking appointment:", error);
    return {
      status: "error",
      message: error.response?.data?.message || "Failed to check appointment",
    };
  }
};

/**
 * Submit KIOSK data and update the patient's existing record
 * Also starts the patient time tracking automatically
 * @param {Object} patient - Patient data from KIOSK form
 * @param {string} encounterId - Encounter ID to match with existing appointment
 * @returns {Promise} - API response
 */
export const addPatient = async (patient, encounterId) => {
  try {
    // Format data for the backend
    const kioskData = {
      // Personal information
      personalInfo: {
        fullName: patient.userInfo.fullName,
        email: patient.demographicsInfo.email,
        phone: patient.demographicsInfo.phone,
        address: patient.demographicsInfo.address,
        address2: patient.demographicsInfo.address2,
        city: patient.demographicsInfo.city,
        state: patient.demographicsInfo.state,
        zipcode: patient.demographicsInfo.zipcode,
      },

      // Primary insurance
      primaryInsurance: {
        name: patient.primaryInsurance.insuranceName,
        memberId: patient.primaryInsurance.memberId,
        groupName: patient.primaryInsurance.groupName || "",
        groupNumber: patient.primaryInsurance.groupNumber || "",
        phoneNumber: patient.primaryInsurance.phoneNumber || "",
        copay: patient.primaryInsurance.copay || 0,
        specialistCopay: patient.primaryInsurance.specialistCopay || 0,
        activeDate: new Date(),
      },

      // Secondary insurance (if available)
      secondaryInsurance: patient.secondaryInsurance
        ? {
            name: patient.secondaryInsurance.insuranceName,
            memberId: patient.secondaryInsurance.memberId,
            groupName: patient.secondaryInsurance.groupName || "",
            groupNumber: patient.secondaryInsurance.groupNumber || "",
            phoneNumber: patient.secondaryInsurance.phoneNumber || "",
            copay: patient.secondaryInsurance.copay || 0,
            specialistCopay: patient.secondaryInsurance.specialistCopay || 0,
            activeDate: new Date(),
          }
        : undefined,

      // Medical information
      medicalInfo: {
        allergies: patient.medicalInfo?.allergies || [],
        medications: patient.medicalInfo?.medications || [],
        medicalHistory: patient.medicalInfo?.medicalHistory || [],
        surgicalHistory: patient.medicalInfo?.surgicalHistory || [],
        familyHistory: patient.medicalInfo?.familyHistory || [],
        socialHistory: patient.medicalInfo?.socialHistory || [],
        shoeSize: patient.medicalInfo?.shoeSize || "",
      },

      // KIOSK check-in information
      kioskCheckIn: {
        location: "Your Total Foot Care Specialist",
        hasHIPAASignature: true,
        hasPracticePoliciesSignature: true,
        hasUploadedPictures: !!patient.uploadedPictures?.length,
      },

      // Start patient time tracking automatically
      visitTimes: {
        rawEvents: [
          {
            label: "patient_start",
            time: new Date(),
          },
        ],
      },
    };

    // Submit KIOSK data to update the appointment
    const response = await api.patch(`/kiosk/submit/${encounterId}`, kioskData);

    if (response.data.success) {
      return {
        id: encounterId,
        status: "success",
        message: "Check-in completed successfully",
      };
    } else {
      return {
        status: "error",
        message: response.data.message || "Failed to submit check-in data",
      };
    }
  } catch (error) {
    console.error("Error during patient check-in:", error);

    // Handle specific error responses
    if (error.response) {
      return {
        status: "error",
        message: error.response.data.message || "Error processing check-in",
      };
    }

    return {
      status: "error",
      message: "Network or server error, please try again",
    };
  }
};

/**
 * Get all patients data for today
 * @returns {Promise} - API response with all patient data
 */
export const getPatientsData = async function () {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Get all appointments for today
    const response = await api.get(`/appointments?date=${today}`);

    if (response.data.success) {
      return response.data.data;
    } else {
      console.error("Failed to fetch patient data:", response.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return [];
  }
};

const apiFunctions = {
  checkAppointment,
  addPatient,
  getPatientsData,
};

export default apiFunctions;
