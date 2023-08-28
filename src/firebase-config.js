import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {GoogleAuthProvider, getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAMRiF9tccIJ3yrLRNOq2rlrBUR0uYBm9s",
  authDomain: "blogging-app-react.firebaseapp.com",
  projectId: "blogging-app-react",
  storageBucket: "blogging-app-react.appspot.com",
  messagingSenderId: "894275077126",
  appId: "1:894275077126:web:56659e3062df9e18c5ef87",
  measurementId: "G-3Y6Z5VDXFH"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const auth=getAuth(app);
export const provider=new GoogleAuthProvider();
export const db=getFirestore(app);