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
    const searchDate = date || getLocalDate();
    
    console.log("🔍 Querying Firestore for patient:", firstName, lastName, "DOB:", dateOfBirth, "on date:", searchDate);
    
    // Normalize strings for comparison
    const normalizeString = (str) => str.toLowerCase().trim();
    
    // Helper to normalize dates for comparison
    const normalizeDOB = (dobString) => {
      if (!dobString) return null;
      
      try {
        // Parse the date string (handles "May 12, 1942", "1942-05-12", "5/12/1942", etc.)
        const dateObj = new Date(dobString);
        
        // Check if valid date
        if (isNaN(dateObj.getTime())) {
          return null;
        }
        
        // Return normalized format: YYYY-MM-DD
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      } catch (e) {
        console.warn("Could not parse DOB:", dobString, e);
        return null;
      }
    };
    
    // Normalize the input DOB for comparison
    const normalizedInputDOB = normalizeDOB(dateOfBirth);
    
    // Query patients collection - Firestore queries are case-sensitive
    // So we query broadly and filter in memory for case-insensitive matching
    const patientsRef = collection(db, "patients");
    
    // Option 1: Try with exact case first (faster if data uses title case)
    let q = query(
      patientsRef,
      where("firstName", "==", firstName)
    );
    
    let querySnapshot = await getDocs(q);
    
    // Option 2: If not found, try with capitalized first letter
    if (querySnapshot.empty && firstName.length > 0) {
      const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      console.log("🔍 Trying with capitalized name:", capitalizedFirstName);
      q = query(
        patientsRef,
        where("firstName", "==", capitalizedFirstName)
      );
      querySnapshot = await getDocs(q);
    }
    
    // Option 3: If still not found, get all patients and filter in memory (less efficient but works)
    if (querySnapshot.empty) {
      console.log("🔍 Querying all patients for case-insensitive search...");
      querySnapshot = await getDocs(patientsRef);
    }
    
    if (querySnapshot.empty) {
      console.log("❌ No patients found in database");
      return null;
    }
    
    console.log(`🔍 Found ${querySnapshot.docs.length} patient(s) to check`);
    
    // Filter by last name, DOB, and appointment date in memory
    const matchingPatients = querySnapshot.docs.filter(doc => {
      const patientData = doc.data();
      
      console.log("🔍 Checking patient:", patientData.firstName, patientData.lastName, "DOB:", patientData.dateOfBirth);
      
      // Check last name match (case-insensitive)
      if (normalizeString(patientData.lastName || "") !== normalizeString(lastName)) {
        console.log("❌ Last name doesn't match:", patientData.lastName, "vs", lastName);
        return false;
      }
      
      console.log("✅ Last name matches");
      
      // Check DOB match - normalize both dates for comparison
      const patientDOB = normalizeDOB(patientData.dateOfBirth);
      
      console.log("🔍 Comparing DOBs - Input:", normalizedInputDOB, "Patient:", patientDOB, "Original:", patientData.dateOfBirth);
      
      if (!patientDOB || !normalizedInputDOB || patientDOB !== normalizedInputDOB) {
        console.log("❌ DOB doesn't match");
        return false;
      }
      
      console.log("✅ DOB matches");
      
      // Check appointment date
      const appointmentDate = patientData.appointmentDate || "";
      if (!appointmentDate) {
        console.log("⚠️  No appointment date for patient");
        return false;
      }
      
      // Parse search date (format: YYYY-MM-DD)
      const [year, month, day] = searchDate.split('-');
      const searchYear = parseInt(year, 10);
      const searchMonth = parseInt(month, 10);
      const searchDay = parseInt(day, 10);
      
      // Try to parse appointmentDate (various formats)
      let appointmentDateObj;
      
      try {
        // Try parsing as "Jan 25, 2026", "January 25, 2026", etc.
        appointmentDateObj = new Date(appointmentDate);
        
        console.log("📅 Appointment date comparison:", {
          original: appointmentDate,
          parsed: appointmentDateObj,
          searchDate: searchDate,
          searchYear, searchMonth, searchDay
        });
        
        // Check if valid date
        if (!isNaN(appointmentDateObj.getTime())) {
          const aptYear = appointmentDateObj.getFullYear();
          const aptMonth = appointmentDateObj.getMonth() + 1; // 0-indexed
          const aptDay = appointmentDateObj.getDate();
          
          console.log("📅 Comparing dates - Appointment:", `${aptYear}-${aptMonth}-${aptDay}`, "Search:", `${searchYear}-${searchMonth}-${searchDay}`);
          
          // Compare year, month, day
          if (aptYear === searchYear && aptMonth === searchMonth && aptDay === searchDay) {
            console.log("✅ Appointment date matches!");
            return true;
          } else {
            console.log("❌ Appointment date does not match");
          }
        }
      } catch (e) {
        console.warn("⚠️  Error parsing appointment date:", e);
      }
      
      // Fallback: String matching for various formats
      const monthNum = searchMonth;
      const dayNum = searchDay;
      
      // Check various date formats:
      // - YYYY-MM-DD, YYYY/MM/DD
      // - MM/DD/YYYY, M/D/YYYY
      // - DD/MM/YYYY, D/M/YYYY
      const stringMatch = appointmentDate.includes(searchDate) || 
             appointmentDate.includes(searchDate.replace(/-/g, "/")) ||
             appointmentDate.includes(`${monthNum}/${dayNum}/${year}`) ||
             appointmentDate.includes(`${month}/${day}/${year}`) ||
             appointmentDate.includes(`${dayNum}/${monthNum}/${year}`);
      
      if (stringMatch) {
        console.log("✅ Appointment date matched via string comparison");
      } else {
        console.log("❌ Appointment date no match via any method");
      }
      
      return stringMatch;
    });
    
    if (matchingPatients.length === 0) {
      console.log("❌ No matching patient found for today's appointments");
      return null;
    }
    
    // Get the first matching patient
    const patientDoc = matchingPatients[0];
    const patientData = patientDoc.data();
    
    // Check if already checked in
    if (patientData.checkInStatus && patientData.checkInStatus !== "not-checked-in") {
      console.log("⚠️  Patient already checked in");
      return null;
    }
    
    // Return complete patient data for verification and form auto-population
    return {
      id: patientDoc.id,
      ...patientData
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
