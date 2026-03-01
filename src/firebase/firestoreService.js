// Firestore service for Kiosk app
import { 
  collection, 
  query, 
  where, 
  getDocs,
  getDoc,
  addDoc, 
  updateDoc,
  doc,
  Timestamp 
} from "firebase/firestore";
import { db } from "./config";
import { getDateRange } from "../utils/dateUtils";

/**
 * Get local date in YYYY-MM-DD format
 */
const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Verify patient by name and date of birth by querying Firestore patients collection
 * @param {string} firstName - Patient's first name
 * @param {string} lastName - Patient's last name
 * @param {string} dateOfBirth - Date of birth in YYYY-MM-DD format
 * @param {string} date - Appointment date in YYYY-MM-DD format (optional, defaults to today)
 * @returns {Promise<Object|null>} - Patient data if found, null otherwise
 */
export const verifyPatientByNameAndDOB = async (firstName, lastName, dateOfBirth, date = null) => {
  try {
    // Get date range for appointment date query
    const searchDate = date ? new Date(date) : new Date();
    const { start, end } = getDateRange(searchDate);
    
    // Normalize names for case-insensitive comparison
    const firstNameLower = firstName.toLowerCase().trim();
    const lastNameLower = lastName.toLowerCase().trim();
    
    // Normalize DOB for comparison
    const inputDOBDate = new Date(dateOfBirth);
    const normalizedInputDOB = isNaN(inputDOBDate.getTime()) ? null : inputDOBDate.toISOString().split('T')[0];
    
    console.log("🔍 Querying Firestore for patient:", firstName, lastName, "DOB:", dateOfBirth);
    console.log("📅 Date range:", {
      start: start.toDate().toISOString(),
      end: end.toDate().toISOString(),
      startSeconds: start.seconds,
      endSeconds: end.seconds
    });
    
    // Query with case-insensitive name fields and Timestamp date range
    const patientsRef = collection(db, "patients");
    const q = query(
      patientsRef,
      where("firstNameLower", "==", firstNameLower),
      where("lastNameLower", "==", lastNameLower),
      where("appointmentDate", ">=", start),
      where("appointmentDate", "<=", end)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("❌ No patients found matching criteria");
      console.log("🔍 Debug: Checking for patients with this name (without date filter)...");
      
      // Debug query without date filter
      const debugQuery = query(
        patientsRef,
        where("firstNameLower", "==", firstNameLower),
        where("lastNameLower", "==", lastNameLower)
      );
      const debugSnapshot = await getDocs(debugQuery);
      
      if (!debugSnapshot.empty) {
        debugSnapshot.docs.forEach(doc => {
          const data = doc.data();
          console.log("🔍 Found patient but date didn't match:", {
            name: `${data.firstName} ${data.lastName}`,
            dob: data.dateOfBirth,
            appointmentDateSeconds: data.appointmentDate?.seconds,
            appointmentDateISO: data.appointmentDate ? new Date(data.appointmentDate.seconds * 1000).toISOString() : 'N/A'
          });
        });
      }
      
      return null;
    }
    
    console.log(`🔍 Found ${querySnapshot.docs.length} potential match(es)`);
    
    // Filter by DOB and check-in status
    const matchingPatient = querySnapshot.docs.find(doc => {
      const patientData = doc.data();
      
      // Check DOB match
      let dobMatches = false;
      if (patientData.dateOfBirth && normalizedInputDOB) {
        const patientDOBDate = new Date(patientData.dateOfBirth);
        const normalizedPatientDOB = isNaN(patientDOBDate.getTime()) ? null : patientDOBDate.toISOString().split('T')[0];
        dobMatches = normalizedPatientDOB === normalizedInputDOB;
      }
      
      // Must not be checked in yet
      const notCheckedIn = !patientData.checkInStatus || patientData.checkInStatus === "not-checked-in";
      
      return dobMatches && notCheckedIn;
    });
    
    if (!matchingPatient) {
      console.log("❌ No matching patient found or patient already checked in");
      return null;
    }
    
    // Return complete patient data
    console.log("✅ Patient verified successfully");
    return {
      id: matchingPatient.id,
      ...matchingPatient.data()
    };
  } catch (error) {
    console.error("❌ Error verifying patient from Firestore:", error);
    throw error;
  }
};

/**
 * LEGACY: Verify encounter ID by querying Firestore patients collection
 * @deprecated Use verifyPatientByNameAndDOB instead
 * @param {string} encounterId - Encounter ID to verify
 * @param {string} date - Date in YYYY-MM-DD format (optional, defaults to today)
 * @returns {Promise<Object|null>} - Patient data if found, null otherwise
 */
export const verifyEncounterIdFromFirestore = async (encounterId, date = null) => {
  try {
    const searchDate = date || getLocalDate();
    
    console.log("🔍 Querying Firestore for encounter ID:", encounterId, "on date:", searchDate);
    
    // Query patients collection by encounter ID only
    // We'll filter by date in memory since appointmentDate format may vary
    const patientsRef = collection(db, "patients");
    const q = query(
      patientsRef,
      where("encounterId", "==", encounterId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("❌ No patient found with encounter ID:", encounterId);
      return null;
    }
    
    // Filter by appointment date (handle various date formats)
    const matchingPatients = querySnapshot.docs.filter(doc => {
      const patientData = doc.data();
      const appointmentDate = patientData.appointmentDate || "";
      
      if (!appointmentDate) return false;
      
      // Parse search date (format: YYYY-MM-DD)
      const [year, month, day] = searchDate.split('-');
      const searchYear = parseInt(year, 10);
      const searchMonth = parseInt(month, 10);
      const searchDay = parseInt(day, 10);
      
      // Try to parse appointmentDate (various formats)
      let appointmentDateObj;
      
      try {
        // Try parsing as "Jan 22, 2026", "January 22, 2026", etc.
        appointmentDateObj = new Date(appointmentDate);
        
        // Check if valid date
        if (!isNaN(appointmentDateObj.getTime())) {
          const aptYear = appointmentDateObj.getFullYear();
          const aptMonth = appointmentDateObj.getMonth() + 1; // 0-indexed
          const aptDay = appointmentDateObj.getDate();
          
          // Compare year, month, day
          if (aptYear === searchYear && aptMonth === searchMonth && aptDay === searchDay) {
            return true;
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
      
      // Fallback: String matching for various formats
      const monthNum = searchMonth;
      const dayNum = searchDay;
      
      // Check various date formats:
      // - YYYY-MM-DD, YYYY/MM/DD
      // - MM/DD/YYYY, M/D/YYYY
      // - DD/MM/YYYY, D/M/YYYY
      return appointmentDate.includes(searchDate) || 
             appointmentDate.includes(searchDate.replace(/-/g, "/")) ||
             appointmentDate.includes(`${monthNum}/${dayNum}/${year}`) ||
             appointmentDate.includes(`${month}/${day}/${year}`) ||
             appointmentDate.includes(`${dayNum}/${monthNum}/${year}`);
    });
    
    if (matchingPatients.length === 0) {
      console.log("❌ Patient found but not scheduled for today:", searchDate);
      return null;
    }
    
    // Get first matching patient
    const patientDoc = matchingPatients[0];
    const patientData = patientDoc.data();
    
    // Check if already checked in
    if (patientData.checkInStatus !== "not-checked-in") {
      console.log("⚠️  Patient already checked in");
    }
    
    console.log("✅ Found patient:", patientData.firstName, patientData.lastName);
    console.log("📊 Full patient data from Firestore:", patientData);
    console.log("🔍 Specific fields - DOB:", patientData.dateOfBirth, "Facility:", patientData.facilityName);
    
    // Return complete patient data for verification and form auto-population
    // Return all fields to ensure nothing is missed
    const result = {
      id: patientDoc.id,
      ...patientData, // Include all fields from Firestore
    };
    
    console.log("📤 Returning result:", result);
    return result;
  } catch (error) {
    console.error("❌ Error verifying encounter ID from Firestore:", error);
    throw error;
  }
};

/**
 * Submit kiosk data to Firestore
 * Creates kiosk data document and updates patient check-in status
 * @param {string} patientId - Patient document ID
 * @param {Object} kioskData - Complete kiosk form data
 * @returns {Promise<string>} - Kiosk data document ID
 */
export const submitKioskDataToFirestore = async (patientId, kioskData) => {
  try {
    console.log("Submitting kiosk data to Firestore for patient:", patientId);
    
    // Add timestamps
    const dataToSave = {
      ...kioskData,
      checkInTime: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    // Save to kioskData collection
    const kioskDataRef = collection(db, "kioskData");
    const docRef = await addDoc(kioskDataRef, dataToSave);
    
    console.log("Kiosk data saved with ID:", docRef.id);
    
    // Update patient document with check-in status
    const patientRef = doc(db, "patients", patientId);
    await updateDoc(patientRef, {
      checkInStatus: "checked-in",
      checkInTime: Timestamp.now(),
      kioskDataId: docRef.id,
      phone: kioskData.demographicsInfo?.phone,
      email: kioskData.demographicsInfo?.email,
      updatedAt: Timestamp.now(),
    });
    
    console.log("Patient check-in status updated");
    
    return docRef.id;
  } catch (error) {
    console.error("Error submitting kiosk data to Firestore:", error);
    throw error;
  }
};

/**
 * Get patient by ID from Firestore
 * @param {string} patientId - Patient document ID
 * @returns {Promise<Object|null>} - Patient data if found
 */
export const getPatientById = async (patientId) => {
  try {
    const patientRef = doc(db, "patients", patientId);
    const patientDoc = await getDoc(patientRef);
    
    if (patientDoc.exists()) {
      return {
        id: patientDoc.id,
        ...patientDoc.data(),
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting patient from Firestore:", error);
    throw error;
  }
};
