import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAXZLvpHwmkFUqP9hn7LijYsyXMaoAx6Es",
  authDomain: "infoa-c05a3.firebaseapp.com",
  projectId: "infoa-c05a3",
  storageBucket: "infoa-c05a3.firebasestorage.app",
  messagingSenderId: "318288284821",
  appId: "1:318288284821:web:60ab061fee7ca4f5111f9c",
  measurementId: "G-DXYR6J6BP7"
};
  
  
// INICIALIZAR O FIREBASE
let app;
if (firebase.apps.length == 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();
export { auth, firestore, storage };