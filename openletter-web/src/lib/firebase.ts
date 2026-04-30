import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCMktP6kIdv4O2Iu23ph4j0rv_gEm_PsY8',
  authDomain: 'open-letter-house.firebaseapp.com',
  projectId: 'open-letter-house',
  storageBucket: 'open-letter-house.firebasestorage.app',
  messagingSenderId: '721729597237',
  appId: '1:721729597237:web:48e0a1f9c5d3bf12c2667c',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
