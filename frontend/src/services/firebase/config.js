import {initializeApp} from 'firebase/app';
import 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBpI0SsXA11jSRcfuuVqT5iOW_fH6g19vc",
    authDomain: "ai4career.firebaseapp.com",
    projectId: "ai4career",
    storageBucket: "ai4career.appspot.com",
    messagingSenderId: "985389595692",
    appId: "1:985389595692:web:ae0b635c2b38dd93f7a589",
    measurementId: "G-PERKJ7GFQG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

const db = getFirestore(app);

export default app;
export { storage, db };




