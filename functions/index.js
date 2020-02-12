const functions = require('firebase-functions');
const app = require('express')();

const {firebaseAuth} = require('./util/firebaseAuth')
const {getAllPosts, addPost, getPost} = require('./handlers/posts')
const {login, signup, uploadImage, addUserDetails, getRegisteredUser} = require('./handlers/users');

app.get('/posts', getAllPosts);
app.post('/posts', firebaseAuth, addPost);
app.get('/post/:postId', getPost);

// TODO: delete post
// TODO: like a post
// TODO: unlike a post
// TODO: post on post 


app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', firebaseAuth, uploadImage)
app.post('/user/',  firebaseAuth, addUserDetails)
app.get('/user/',  firebaseAuth, getRegisteredUser)

exports.api = functions.https.onRequest(app);