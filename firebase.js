
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDKJiaTnZJ5BQ6cVciyjbEBb-ami9h1sLw",
    authDomain: "instagram-clone-9263e.firebaseapp.com",
    databaseURL: "https://instagram-clone-9263e.firebaseio.com",
    projectId: "instagram-clone-9263e",
    storageBucket: "instagram-clone-9263e.appspot.com",
    messagingSenderId: "928959909538",
    appId: "1:928959909538:web:5c5d534f69b8e258f051fb",
    measurementId: "G-LBE0SEYECW"
})

/*we are grabing three services from firebase and storing in three variables below */
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};