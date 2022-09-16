import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC_Iuv6ETGSKtDzgr3Keyx0ySyifx31GIs',
  authDomain: 'medical-management-web-app.firebaseapp.com',
  projectId: 'medical-management-web-app',
  storageBucket: 'medical-management-web-app.appspot.com',
  messagingSenderId: '1053146750088',
  appId: '1:1053146750088:web:a78cfb38c1888097f3133d',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
