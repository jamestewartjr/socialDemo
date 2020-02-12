const functions = require('firebase-functions');
const app = require('express')();

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