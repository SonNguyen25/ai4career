import {initializeApp} from 'firebase/app';
import 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    //Hidden
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

const db = getFirestore(app);

export default app;
export { storage, db };




