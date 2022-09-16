import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

export const addPatient = async (patient) => {
  try {
    const kioskRef = await addDoc(collection(db, 'kiosk'), patient);
    const returnPatient = { id: kioskRef.id, status: 'success' };
    return returnPatient;
  } catch (e) {
    return e;
  }
};
