const functions = require('firebase-functions');
const app = require('express')();

const firebaseAuth = require('./util/firebaseAuth')
const {getAllComments, postComment} = require('./handlers/comments')
const {login, signup, uploadImage} = require('./handlers/users');

app.get('/comments', getAllComments);
// app.post('/comments', firebaseAuth, postComment);

app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', firebaseAuth, uploadImage)

exports.api = functions.https.onRequest(app);