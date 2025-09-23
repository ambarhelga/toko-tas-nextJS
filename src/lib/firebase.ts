
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "studio-1871759932-bd379",
  "appId": "1:930421194670:web:13356a977c08fd34ae123f",
  "apiKey": "AIzaSyDKxiXRvj17f-gOhtAFSj13i6YEWmlCewQ",
  "authDomain": "studio-1871759932-bd379.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "930421194670"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
