const {db} = require('../util/admin');
const firebaseConfig = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const {validateSignup, validateLogin} = require('../util/validators');

const login = (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password,
  };

  const {valid, errors} = validateLogin(user);

  if(!valid) return response.status(400).json(errors);

  return firebase.auth()
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
};

const signup = (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPass: request.body.confirmPass,
    userName: request.body.userName
  };

  const {valid, errors} = validateSignup(newUser);

  if(!valid) return response.status(400).json(errors);


  let tokenValue,userId;

  return db.doc(`/users/${newUser.userName}`).get()
    .then(doc => {
      if(doc.exists){
        return response.status(400).json({ userName: 'This username is already in use.'});
      }
      else { 
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    .catch(error => {
      console.error(error)
      return response.status(500).json({error: error})
    })
    .then( data => {
      // userId = data.user.uid;
      return data.user.getIdToken();
    })
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
};

module.exports = {
  login,
  signup
}