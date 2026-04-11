import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCFnERZ-tczi_WXMmylevKFzXIR4Y9GF1s',
  authDomain: 'autorickshaw-649b1.firebaseapp.com',
  projectId: 'autorickshaw-649b1',
  storageBucket: 'autorickshaw-649b1.firebasestorage.app',
  messagingSenderId: '201263643518',
  appId: '1:201263643518:web:d1883ec7b0b236222c912f',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
