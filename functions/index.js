const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
const firebase = require('firebase');
// const {isEmail, isEmpty} = require('../util/validators');
const isEmpty = (str) => {
  if(str.trim() === '') return true;
  else return false;
}

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};
admin.initializeApp(functions.config().firebase);

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

firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

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

  db.collection('comments')
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

  let errors = {};

  if(isEmpty(newUser.email)){
    errors.email = 'Must not be empty.'
  } else if (!isEmail(newUser.email)) {
    errors.email = 'Must be a valid email address.'
  }

  if(isEmpty(newUser.password)){
    errors.password = 'Must not be empty.'
  } 

  if(isEmpty(newUser.userName)){
    errors.userName = 'Must not be empty.'
  } 

  if(newUser.password !== newUser.confirmPass){
    errors.confirmPass = 'Passwords must match'
  } 

  if(Object.keys(errors).length > 0) return response.status(400).json(errors)

  let tokenValue,userId;

  db.doc(`/users/${newUser.userName}`).get()
    .then(doc => {
      if(doc.exists){
        return response.status(400).json({ userName: 'This username is already in use.'});
      }
      else { 
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    // .catch(error => {
    //   console.error(error)
    //   return response.status(500).json({error: error})
    // })
    // .then( data => {
    //   // userId = data.user.uid;
    //   return data.user.getIdToken();
    // })
    .then( (token) => {
      tokenValue = token;
      const userCredentials = {
        email: newUser.email,
        password: newUser.password,
        confirmPass: newUser.confirmPass,
        userName: newUser.userName,
        createdAt: new Date().toISOString()
      };
      response.status(201).json({tokenValue})
      return db.doc(`/users/${newUser.userName}`).set(userCredentials);
    })
    .catch(error => {
      console.error(error)
      if(error.code === 'auth/email-already-in-use'){
        return response.status(400).json({ email: 'Email is already in use.'})
      }else {
        return response.status(500).json({error: error})
      }
    });
});

app.post('/login', (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password,
  };

  let errors = {};

  if(isEmpty(newUser.email)){
    errors.email = 'Must not be empty.'
  } else if (!isEmail(newUser.email)) {
    errors.email = 'Must be a valid email address.'
  }

  if(isEmpty(newUser.password)){
    errors.password = 'Must not be empty.'
  } 

  if(Object.keys(error).length > 0) return response.status(400).json(errors);

  firebase.auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return response.json({token})
    })
    .catch(error => {
      console.error(error);
      if(error.code === 'auth/wrong-password'){
        return response.status(403).json({general: 'Wrong credentials.'});

      } else return response.status(500).json({error: error})
    })
})

exports.api = functions.https.onRequest(app);