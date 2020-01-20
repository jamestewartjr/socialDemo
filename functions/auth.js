const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
const firebase = require('firebase');

const firebaseConfig = {
  apiKey: "AIzaSyAt9i5XiZyom2mXsOSpLfd_0ILgDZ6uLhM",
  authDomain: "socialdemospa.firebaseapp.com",
  databaseURL: "https://socialdemospa.firebaseio.com",
  projectId: "socialdemospa",
  storageBucket: "socialdemospa.appspot.com",
  messagingSenderId: "456078504994",
  appId: "1:456078504994:web:236a86e05020e2b717867b",
  measurementId: "G-17M8KBTB0B"
};

admin.initializeApp();
firebase.initializeApp(firebaseConfig);

app.post('/signup', (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPass: request.body.confirmPass,
    userName: request.body.userName
  };

  firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
      return response.status(201).json({message: `User ${data.user.uid} is now signed up.`})
    })
    .catch(error => {
      console.error(error)
      return response.status(500).json({error: error.code})
    });
})

exports.api = functions.https.onRequest(app);