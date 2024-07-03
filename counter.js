import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getDatabase, ref, onValue } from "firebase/database";


// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const realtime_database = getDatabase(app);
let globalCounter = 0
// const analytics = getAnalytics(app);
const querySnapshot = await getDocs(collection(db, "/test"));
  querySnapshot.forEach((doc) => {
    globalCounter = doc.data().value
    console.log(`${doc.id} => ${doc.data().value}`);
  });


  const starCountRef = ref(realtime_database, '/products');
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data)
  });

export function setupCounter(element) {
  
  let counter = globalCounter
  
  const setCounter = (count) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(counter)
}
