const {db} = require('../util/admin')

const getAllPosts = (request, response) => {
  db
    .collection('posts')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let posts = [];
      data.forEach((doc) => {
        posts.push({
          postId: doc.id,
          body: doc.data().body,
          userName: doc.data().userName,
          createdAt: doc.data().createdAt
        });
      })
      return response.json(posts);
    })
    .catch((error)=> console.error('Error: ', error));
};

const addPost = (request, response) => {
  const newPosts = {
    body: request.body.body,
    userName: request.user.userName,
    createdAt: new Date().toISOString()
  };

  db.collection('posts')
    .add(newPosts)
    .then(doc => {return response.json({ message: `document ${doc.id} created successfully`})})
    .catch(error => {
      console.error('error: ',error)
      return response.status(500).json({error: 'Something went wrong. Bad Response'})
    })
};

const getPost = (request, response) => {
  let postData = {};
  db.doc(`/posts/${request.params.postId}`).get()
    .then( doc => {
      if(!doc.exists){
        return response.status(400).json({error: 'Post not found.'})
      }
      postData = doc.data();
      postData.postId = doc.id;
      return db.collection('comments')
        .orderBy('createdAt', 'desc')
        .where('postId', '==', request.params.postId)
        .get();
    })
      .then( data => { 
        postData.comments = []
        data.forEach((doc) => {
          console.log('doc2push: ', doc)
          postData.comments.push(doc.data());
        })
      return response.json(postData);
    })
    .catch((error)=> {
      console.error('Error: ', error)
      response.status(500).json({error: error})
    });

}

module.exports = {
  addPost,
  getAllPosts,
  getPost
}