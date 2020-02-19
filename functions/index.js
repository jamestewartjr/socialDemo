const functions = require('firebase-functions');
const app = require('express')();
const {db} = require('./util/admin');

const {firebaseAuth} = require('./util/firebaseAuth')
const {
  addPost, 
  commentOnPost, 
  deletePost,
  getAllPosts, 
  getPost,
  likePost,
  unlikePost
} = require('./handlers/posts')
const {
  login, 
  signup, 
  uploadImage, 
  addUserDetails, 
  getRegisteredUser
} = require('./handlers/users');

app.get('/posts', getAllPosts);
app.post('/posts', firebaseAuth, addPost);
app.get('/post/:postId', getPost);
app.post('/post/:postId/comment', firebaseAuth, commentOnPost);
app.delete('/post/:postId', firebaseAuth, deletePost);
app.get('/post/:postId/like', firebaseAuth, likePost);
app.get('/post/:postId/unlike', firebaseAuth, unlikePost);


app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', firebaseAuth, uploadImage)
app.post('/user/',  firebaseAuth, addUserDetails)
app.get('/user/',  firebaseAuth, getRegisteredUser)

exports.api = functions.https.onRequest(app);

exports.sendNotificationOnLike = functions.firestore.document('likes/{id}')
  .onCreate((snapshot) => {
    db.doc(`/posts/${snapshot.data().postId}`).get()
      .then(doc => {
        if(doc.exists){
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            receipient: doc.data().userName,
            sender: snapshot.data().userName,
            type: 'like',
            read: false,
            postId: doc.id
          });
        }
        return null;
      })
      .catch( error => {
        console.error({ error: error})
        return;
      })
  })

  exports.deleteNotificationOnUnLike = functions
  .firestore.document('likes/{id}')
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });

  exports.sendNotificationOnComment = functions
  .firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists && doc.data().userName !== snapshot.data().userName
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userName,
            sender: snapshot.data().userName,
            type: 'comment',
            read: false,
            postId: doc.id
          });
        }
          return null;
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });