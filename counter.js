import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getDatabase, ref, child, get } from "firebase/database";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

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
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const realtime_database = getDatabase(app);
const auth = getAuth(app);
let globalCounter = 0;
// const analytics = getAnalytics(app);
const querySnapshot = await getDocs(collection(db, "/test"));
querySnapshot.forEach((doc) => {
  globalCounter = doc.data().value;
  console.log(`${doc.id} => ${doc.data().value}`);
});

// const starCountRef = ref(realtime_database, '/products');
// onValue(starCountRef, (snapshot) => {
//   const data = snapshot.val();
//   console.log(data)
// });
let myCategories = {};
const dbRef = ref(realtime_database);
get(child(dbRef, `/categories`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
      myCategories = snapshot.val();
      generateDivs();
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });

export function setupCounter(element) {
  let counter = globalCounter;

  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener("click", () => setCounter(counter + 1));
  setCounter(counter);
}

//авторизация
const authForm = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signInButton = document.getElementById("sign-in");
const signUpButton = document.getElementById("sign-up");
const errorMessage = document.getElementById("error-message");

authForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  if (signInButton === event.submitter) {
    SignIn(email, password);
  } else if (signUpButton === event.submitter) {
    SignUp(email, password);
  }
});

// Sign in with email and password
function SignIn(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user.uid); // Redirect to signed-in page
    })
    .catch((error) => {
      errorMessage.textContent = error.message;
    });
}

// Sign up with email and password
function SignUp(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up and signed in
      const user = userCredential.user;
      console.log(user.uid); // Redirect to signed-in page
    })
    .catch((error) => {
      errorMessage.textContent = error.message;
    });
}

//динамические обхекты

function generateDivs() {
  const container = document.getElementById("my_categories");
  for (const [key, value] of Object.entries(myCategories)) {
    console.log(key, value);
    //созщдаем div контейнер
    const div_container = document.createElement("div");
    div_container.className = 'div_container'+key

    //наполняем дим контейнер кнопкой
    const button = document.createElement("button");
    button.className = "button_" + key;
    button.textContent = "Продукт базы: " + key;
    button.addEventListener("click", function (btn) {
      console.log("Нажат продукт " + this.className);
    });

    //наполняем див конейтер изображением из базы даннызх
    const img = document.createElement("img");
    img.src = value['img']
    div_container.appendChild(button)
    div_container.appendChild(img)
    container.appendChild(div_container);

  }
}

// generateDivs()
