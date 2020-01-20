const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express')


const app = express();
admin.initializeApp();

app.get('/comments', (request, response) => {
  admin
  .firestore()
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

  admin.firestore()
    .collection('comments')
    .add(newComments)
    .then(doc => {return response.json({ message: `document ${doc.id} created successfully`})})
    .catch(error => {
      response.status(500).json({error: 'Something went wrong. Bad Response'})
      return console.error(error)
    })
})

exports.api = functions.https.onRequest(app);