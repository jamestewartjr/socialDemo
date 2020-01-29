const {admin, db} = require('../util/admin');
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
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then( (token) => {
      tokenValue = token;
      const userCredentials = {
        email: newUser.email,
        password: newUser.password,
        confirmPass: newUser.confirmPass,
        userName: newUser.userName,
        createdAt: new Date().toISOString(),
        imageUrl:  `https://firebasestorage.googleapis.com/v0/b/${
          conifig.storageBucket
        }/0/new-user-image/?alt=media`,
        userId
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

const uploadImage = (request, response) => {
  const BusBoy = require('busboy');
  const pth = require('path');
  const os = require('os');
  const fs = require('fs');

  const busBoy = new BusBoy({headers: request.headers});

  let imageFileName;
  let imageToBeUploaded = {};

  busBoy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    imageFileName = `${Math.round(Math.random()*10000)}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype};
    file.pipe(fs.createWriteStream(filepath));
  
  });
  busBoy.on('finish', () => {
    admin.storage().bucket().upload(imageToBeUploaded.filepath, {
      resumable: false,
      metadata: {
        metadata: {
          contentType: imageToBeUploaded.mimetype
        }
      }
    })
    .then( () => {
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${conifig.storageBucket}/0/${imageFileName}?alt=media`
      return db.doc(`./users/${request.user.userName}`).update({imageUrl});
    })
    .then( () => {
      return response.json({ message: 'Image uploaded successfully.'})
    })
    .catch( error => {
      console.log(error)
      return response.status(500).json({error: error.code})
    })
  })
  busBoy.end(request.rawBody);
};

module.exports = {
  login,
  signup,
  uploadImage
}