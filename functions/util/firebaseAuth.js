const {admin, db} = require('./admin');
console.log()

exports.firebaseAuth = (request, response, next) => {
  let idToken;
  if(request.headers.authorization && request.headers.authorization.startsWith('Bearer ')){
    idToken = request.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found.')
    return response.status(403).json({ error: 'Unauthorized'});
  }
  admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      request.user = decodedToken;
      return db.collection('users')
        .where('userId', '==', request.user.uid)
        .limit(1)
        .get();
    })
    .then( data => {
      console.info('auth data: ', data)
      request.user.userName = data.docs[0].data().userName;
      request.user.imageUrl = data.docs[0].data().imageUrl;
      return next();
    })
    .catch((error) => {
      console.error('verify token error', error)
      return response.status(403).json({ error:error });
    });
};
