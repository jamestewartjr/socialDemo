const {admin, db} = require('../util/admin');
const firebaseConfig = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const {validateSignup, validateLogin, reduceUserDetails} = require('../util/validators');

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
      console.error('Error: ',error);
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
      console.error('Error: ', error)
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
          firebaseConfig.storageBucket
        }/0/new-user-image/?alt=media`,
        userId
      };
      response.status(201).json({tokenValue})
      return db.doc(`/users/${newUser.userName}`).set(userCredentials);
    })
    .catch(error => {
      console.error('Error: ', error)
      if(error.code === 'auth/email-already-in-use'){
        return response.status(400).json({ email: 'Email is already in use.'})
      }else {
        return response.status(500).json({error: error})
      }
    });
};

const uploadImage = (request, response) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busBoy = new BusBoy({headers: request.headers});

  let imageFileName;
  let imageToBeUploaded = {};

  busBoy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if(mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
      return response.status(400).json({
        error: 'Wrong file type submitted',
        mimetype: mimetype  
    });
    }
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    imageFileName = `${Math.round(Math.random()*10000).toString()}.${imageExtension}`;
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
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`
      return db
      .doc(`/users/${request.user.userName}`)
      .update({imageUrl});
    })
    .then( () => {
      return response.json({ message: 'Image uploaded successfully.'})
    })
    .catch( error => {
      console.error('Error: ',error)
      return response.status(500).json({error:`Image upload failure: ${error}`})
    })
  })
  busBoy.end(request.rawBody);
};

const addUserDetails = (request, response) => {
  let userDetails = reduceUserDetails(request.body);

  db.doc(`/users/${request.user.userName}`).update(userDetails)
    .then(() => {
      return response.json( {message: 'Details updated successfully.'});
    })
    .catch((error) => {
      return response.status(500).json({error:error}) 
    })
};

const getRegisteredUser = (request, response) => {
  let userData = {};
  db.doc(`/users/${request.user.userName}`).get()
    .then(doc => {
      if(doc.exists){
        userData.credentials = doc.data();
        return db.collection('likes')
          .where('userName', '==', request.user.userName)
          .get()  
      }
      return null;
    })
    .then(data => {
      userData.likes = [];
      data.forEach(doc => {
        userData.likes.push(doc.data());
      });
      return db.collection('notifications')
        .where('recipient', '==', request.user.userName)
        .orderBy('createdAt', 'desc').get();
    })
    .then( data => {
      userData.notifications = [];
      data.forEach( doc => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          postId: doc.data().postId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id
        })
      })
      return response.json(userData);
    })
    .catch(error => {
      console.log("Error",error);
      return response.status(500).json({"Error": Error.code})
    })
};

const getUserDetails = (request, response) => {
  let userData = {};
  db.doc(`/users/${request.params.userName}`).get()
    .then( doc => {
      if(doc.exists){
        userData.user = doc.data();
        return db.collection('posts')
          .where('userName', '==', request.params.userName)
          .orderBy('createdAt','desc')
          .get();
      } else {
        return response.status(404).json({error:"User Not found"})
      }
    })
    .then( data => {
      userData.posts = [];
      data.forEach( doc => {
        userData.posts.push({
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          userName: doc.data().userName,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          postId: doc.id,
        })
      })
      return response.json(userData);
    })
    .catch( error => {
      console.error(error);
      return response.status(500).json({error: error});
    })
}

const markNotificationsRead = (request, response) => {
  let batch = db.batch();
  request.body.forEach( notificationId => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, {read: true});
  });
  batch.commit()
    .then( ()=>{
      return response.json({ message: 'Notifications read'});
    })
    .catch( error => {
      console.error(error);
      return response.status(500).json({error: error});
    })
}

module.exports = {
  addUserDetails,
  getRegisteredUser,
  getUserDetails,
  login,
  markNotificationsRead,
  signup,
  uploadImage,
}