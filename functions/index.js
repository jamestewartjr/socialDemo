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

const db = admin.firestore();

admin.initializeApp();
firebase.initializeApp(firebaseConfig);

app.get('/comments', (request, response) => {
  db
    .collection('comments')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let comments = [];
      data.forEach((doc) => {
        comments.push({
          commentId: doc.id,
          body: doc.data().body,
          userName: doc.data().userName,
          createdAt: doc.data().createdAt
        });
      })
      return response.json(comments);
    })
    .catch((error)=> console.error(error));
})

app.post('/comments', ( request, response) => {
  const newComments = {
    body: request.body.body,
    userName: request.body.userName,
    createdAt: new Date().toISOString()
  };

  db  
    .collection('comments')
    .add(newComments)
    .then(doc => {return response.json({ message: `document ${doc.id} created successfully`})})
    .catch(error => {
      response.status(500).json({error: 'Something went wrong. Bad Response'})
      return console.error(error)
    })
})

app.post('/signup', (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPass: request.body.confirmPass,
    userName: request.body.userName
  };

  db.doc(`/users/${newUser.userName}`).get()
    .then(doc => {
      if(doc.exists){
        return response.status(400).json({ handle: 'This handle is already in use.'});
      }
      else { 
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    .then( data => {
      return data.user.getIdToken();
    })
    .then( token => {
      return response.status(201).json({token});
    })
    .catch(error => {
      console.error(error)
      return response.status(500).json({error: error.code})
    });

   
})

exports.api = functions.https.onRequest(app);