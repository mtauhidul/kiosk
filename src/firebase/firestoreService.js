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
 * Verify encounter ID by querying Firestore patients collection
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
