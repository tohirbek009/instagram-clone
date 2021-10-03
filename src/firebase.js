// import firebase from 'firebase';
import firebase from 'firebase/index'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';



const firebaseApp = firebase.initializeApp ({
    apiKey: "AIzaSyCqfe6EWyZcEJ9Kmi6R1wO--t3QYAnJdO0",
    authDomain: "instagram-clone-4f13a.firebaseapp.com",
    projectId: "instagram-clone-4f13a",
    storageBucket: "instagram-clone-4f13a.appspot.com",
    messagingSenderId: "841597845101",
    appId: "1:841597845101:web:fa35151635e693b9944964",
    measurementId: "G-L1NXP5YPFR"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };

