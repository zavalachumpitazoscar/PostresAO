import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDrg-BnPUzlgmOBRym61rqRDGGBSKH3h6M",
  authDomain: "postresao.firebaseapp.com",
  projectId: "postresao",
  storageBucket: "postresao.firebasestorage.app",
  messagingSenderId: "897017656976",
  appId: "1:897017656976:web:0a76960dc53aa3954a0a15"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
