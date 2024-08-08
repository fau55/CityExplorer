// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCM1s5jwDrtyaaMC77Gg8TUf60gdAGE0QM",
  authDomain: "city-exploere.firebaseapp.com",
  projectId: "city-exploere",
  storageBucket: "city-exploere.appspot.com",
  messagingSenderId: "190187256033",
  appId: "1:190187256033:web:988401d76c7e602ac91fa0",
  measurementId: "G-Q3GFJQ6GR2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const imagedb = getStorage(app)