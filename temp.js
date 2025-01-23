// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhiY3rvQu9ZDxk3H4xI3jUw_JZa7vpsVE",
  authDomain: "dreamydelight-7ba4e.firebaseapp.com",
  projectId: "dreamydelight-7ba4e",
  storageBucket: "dreamydelight-7ba4e.appspot.com",
  messagingSenderId: "670453107906",
  appId: "1:670453107906:web:ff1e604bf3837ddc66bf5b",
  measurementId: "G-TM81E5D8WT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

  
  // Define your data as a JSON array
  const menuData = [
      {
        "id": "DD1",
        "name": "Frappuccino",
        "short_name": "F",
        "special_instructions": "Frappuccinos: where sweetness meets chill."
      },
      {
        "id": "DD2",
        "name": "Expresso",
        "short_name": "E",
        "special_instructions": "Espresso: the perfect blend of intensity and elegance in every sip."
      },
      {
        "id": "DD3",
        "name": "Cake Pops",
        "short_name": "CP",
        "special_instructions": "Cake pops: a delightful bite-sized treat that brings joy with every pop."
      },
      {
        "id": "DD4",
        "name": "Donut",
        "short_name": "D",
        "special_instructions": "Donuts: the sweet, round moment of happiness you can hold in your hand"
      }
  ];
  
  // Push data to the database
  // Get a reference to the 'menu-categories' node
const menuRef = ref(database, 'menu-categories');

// Set data in the Realtime Database
set(menuRef, menuData)
  .then(() => {
    console.log('Data written successfully!');
  })
  .catch((error) => {
    console.error('Error writing data:', error);
  });

  