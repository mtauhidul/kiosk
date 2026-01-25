import axios from "axios";
import {
  addAllergiesData,
  addDemographicData,
  addFamilyHistory,
  addMedicalHistory,
  addMedicationsData,
  addPrimaryInsurance,
  addSecondaryInsurance,
  addShoeSize,
  addSocialHistory,
  addSurgicalHistory,
  addUserInfo,
} from "../state/actionCreators"; // Import action creators
import store from "../state/store"; // Import Redux store
import { 
  verifyEncounterIdFromFirestore,
  verifyPatientByNameAndDOB as verifyPatientByNameAndDOBFirestore,
  submitKioskDataToFirestore 
} from "../firebase/firestoreService";

// Set the base URL for the API (v2 endpoints)
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Verify patient by name and date of birth
 * @param {string} firstName - Patient's first name
 * @param {string} lastName - Patient's last name  
 * @param {string} dateOfBirth - Date of birth in YYYY-MM-DD format
 * @returns {Promise} - API response with patient info
 */
export const verifyPatientByNameAndDOB = async (firstName, lastName, dateOfBirth) => {
  try {
    // Use Firestore for verification
    const patient = await verifyPatientByNameAndDOBFirestore(firstName, lastName, dateOfBirth);
    
    if (!patient) {
      return {
        status: "error",
        message: "No appointment found for today. Please check your information.",
      };
    }
    
    // Check if already checked in
    if (patient.checkInStatus && patient.checkInStatus !== "not-checked-in") {
      return {
        status: "error",
        message: "You have already checked in today.",
      };
    }

    return {
      status: "success",
      data: patient, // Return all patient data from Firestore for form prepopulation
    };
  } catch (error) {
    console.error("Error verifying patient:", error);
    return {
      status: "error",
      message: "Failed to verify information. Please try again.",
    };
  }
};

/**
 * LEGACY: Verify encounter ID with Firestore
 * @deprecated Use verifyPatientByNameAndDOB instead
 * @param {string} encounterId - Encounter ID to verify
 * @returns {Promise} - API response with patient info
 */
export const verifyEncounterId = async (encounterId) => {
  try {
    const patient = await verifyEncounterIdFromFirestore(encounterId);
    
    if (!patient) {
      return {
        status: "error",
        message: "Encounter ID not found. Please check your appointment confirmation.",
      };
    }
    
    // Check if already checked in
    if (patient.checkInStatus && patient.checkInStatus !== "not-checked-in") {
      return {
        status: "error",
        message: "This patient has already checked in today.",
      };
    }

    return {
      status: "success",
      data: patient, // Return all patient data from Firestore
    };
  } catch (error) {
    console.error("Error verifying encounter ID:", error);
    return {
      status: "error",
      message: "Failed to verify Encounter ID. Please try again.",
    };
  }
};

/**
 * Submit kiosk data to Firestore
 * @param {string} patientId - Patient ID from verification
 * @param {Object} kioskData - Complete kiosk form data
 * @returns {Promise} - API response
 */
export const submitKioskData = async (patientId, kioskData) => {
  try {
    const kioskDataId = await submitKioskDataToFirestore(patientId, kioskData);

    return {
      status: "success",
      data: {
        kioskDataId,
        message: "Check-in completed successfully!",
      },
    };
  } catch (error) {
    console.error("Error submitting kiosk data:", error);
    
    return {
      status: "error",
      message: "Failed to submit check-in data. Please try again.",
    };
  }
};

/**
 * Check if patient has appointment using encounter ID
 * @param {string} encounterId - Encounter ID to match with existing appointment
 * @returns {Promise} - API response
 */
export const checkAppointment = async (encounterId) => {
  try {
    const response = await api.post("/kiosk/check-in", { encounterId });

    if (response.data.success) {
      // If found an appointment, get the full patient data to populate the Redux store
      await populateReduxStoreWithPatientData(encounterId);

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
 * Fetch patient data by encounter ID and populate the Redux store
 * @param {string} encounterId - Encounter ID to fetch patient data
 */
const populateReduxStoreWithPatientData = async (encounterId) => {
  try {
    // Get the full appointment data
    const response = await api.get(`/appointments/${encounterId}`);

    if (response.data.success) {
      const patientData = response.data.data;

      // Populate redux store with user info
      store.dispatch(
        addUserInfo({
          firstName: patientData.patientFirstName || "",
          lastName: patientData.patientLastName || "",
          middleInitial: patientData.patientMiddleInitial || "",
          fullName:
            patientData.patientName ||
            `${patientData.patientFirstName || ""} ${
              patientData.patientLastName || ""
            }`,
          dob: patientData.patientDOB
            ? new Date(patientData.patientDOB).toISOString().split("T")[0]
            : "",
          gender: patientData.patientGender || "",
        })
      );

      // Populate demographics info
      store.dispatch(
        addDemographicData({
          address: patientData.patientAddressLine1 || "",
          address2: patientData.patientAddressLine2 || "",
          city: patientData.patientCity || "",
          state: patientData.patientState || "",
          zipcode: patientData.patientZIPCode || "",
          email: patientData.patientEmail || "",
          phone:
            patientData.patientCellPhone || patientData.patientHomePhone || "",
          race: patientData.patientRace || "",
          ethnicity: patientData.patientEthnicity || "",
          language: patientData.patientLanguage || "",
        })
      );

      // Populate primary insurance
      if (patientData.primaryInsurance || patientData.primaryInsuranceName) {
        store.dispatch(
          addPrimaryInsurance({
            insuranceName:
              patientData.primaryInsurance?.name ||
              patientData.primaryInsuranceName ||
              "",
            memberId:
              patientData.primaryInsurance?.memberId ||
              patientData.primaryInsuranceSubscriberNo ||
              "",
            groupName: patientData.primaryInsurance?.groupName || "",
            groupNumber: patientData.primaryInsurance?.groupNumber || "",
            phoneNumber: patientData.primaryInsurance?.phoneNumber || "",
            copay: patientData.primaryInsurance?.copay || 0,
            specialistCopay: patientData.primaryInsurance?.specialistCopay || 0,
          })
        );
      }

      // Populate secondary insurance
      if (
        patientData.secondaryInsurance ||
        patientData.secondaryInsuranceName
      ) {
        store.dispatch(
          addSecondaryInsurance({
            insuranceName:
              patientData.secondaryInsurance?.name ||
              patientData.secondaryInsuranceName ||
              "",
            memberId:
              patientData.secondaryInsurance?.memberId ||
              patientData.secondaryInsuranceSubscriberNo ||
              "",
            groupName: patientData.secondaryInsurance?.groupName || "",
            groupNumber: patientData.secondaryInsurance?.groupNumber || "",
            phoneNumber: patientData.secondaryInsurance?.phoneNumber || "",
            copay: patientData.secondaryInsurance?.copay || 0,
            specialistCopay:
              patientData.secondaryInsurance?.specialistCopay || 0,
          })
        );
      }

      // Populate medical information
      if (patientData.medicalInfo) {
        // Allergies
        if (
          patientData.medicalInfo.allergies &&
          Array.isArray(patientData.medicalInfo.allergies)
        ) {
          store.dispatch(addAllergiesData(patientData.medicalInfo.allergies));
        }

        // Medications
        if (
          patientData.medicalInfo.medications &&
          Array.isArray(patientData.medicalInfo.medications)
        ) {
          store.dispatch(
            addMedicationsData(patientData.medicalInfo.medications)
          );
        }

        // Medical history
        if (
          patientData.medicalInfo.medicalHistory &&
          Array.isArray(patientData.medicalInfo.medicalHistory)
        ) {
          store.dispatch(
            addMedicalHistory(patientData.medicalInfo.medicalHistory)
          );
        }

        // Surgical history
        if (
          patientData.medicalInfo.surgicalHistory &&
          Array.isArray(patientData.medicalInfo.surgicalHistory)
        ) {
          store.dispatch(
            addSurgicalHistory(patientData.medicalInfo.surgicalHistory)
          );
        }

        // Family history
        if (patientData.medicalInfo.familyHistory) {
          store.dispatch(
            addFamilyHistory(patientData.medicalInfo.familyHistory)
          );
        }

        // Social history
        if (patientData.medicalInfo.socialHistory) {
          store.dispatch(
            addSocialHistory(patientData.medicalInfo.socialHistory)
          );
        }

        // Shoe size
        if (patientData.medicalInfo.shoeSize) {
          store.dispatch(
            addShoeSize({
              size: patientData.medicalInfo.shoeSize,
            })
          );
        }
      }

      console.log("Redux store populated with patient data");
    }
  } catch (error) {
    console.error("Error populating Redux store with patient data:", error);
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
        allergies: patient.allergies || [],
        medications: patient.medications || [],
        medicalHistory: patient.medicalHistory || [],
        surgicalHistory: patient.surgicalHistory || [],
        familyHistory: patient.familyHistory || {},
        socialHistory: patient.socialHistory || {},
        shoeSize: patient.shoeSize?.size || "",
      },

      // KIOSK check-in information
      kioskCheckIn: {
        location: "Your Total Foot Care Specialist",
        hasHIPAASignature: patient.hippaPolicy?.signature || true,
        hasPracticePoliciesSignature:
          patient.practicePolicies?.signature || true,
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

/**
 * Get a specific appointment by encounterId
 * @param {string} encounterId - The encounter ID to fetch
 * @returns {Promise} - API response with appointment data
 */
export const getAppointment = async (encounterId) => {
  try {
    const response = await api.get(`/appointments/${encounterId}`);

    if (response.data.success) {
      return {
        status: "success",
        data: response.data.data,
      };
    } else {
      return {
        status: "error",
        message: response.data.message || "Appointment not found",
      };
    }
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return {
      status: "error",
      message: error.response?.data?.message || "Failed to fetch appointment",
    };
  }
};

const apiFunctions = {
  verifyEncounterId,
  submitKioskData,
  checkAppointment,
  addPatient,
  getPatientsData,
  getAppointment,
  populateReduxStoreWithPatientData,
};

export default apiFunctions;
