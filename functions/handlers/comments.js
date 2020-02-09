const {db} = require('../util/admin')

const getAllComments = (request, response) => {
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
    .catch((error)=> console.error('Error: ', error));
};
const postComment = (request, response) => {
  const newComments = {
    body: request.body.body,
    userName: request.user.userName,
    createdAt: new Date().toISOString()
  };

  db.collection('comments')
    .add(newComments)
    .then(doc => {return response.json({ message: `document ${doc.id} created successfully`})})
    .catch(error => {
      console.error('error: ',error)
      return response.status(500).json({error: 'Something went wrong. Bad Response'})
    })
};

module.exports = {
  getAllComments,
  postComment
}