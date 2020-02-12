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

const commentOnPost = (request, response) => {
  if (request.body.body.trim() === '') response.status(400).json({ comment: 'Must not be empty' });
  const newComment = {
    body: request.body.body,
    createdAt: new Date().toISOString(),
    postId: request.params.postId,
    userName: request.user.userName,
    userImage: request.user.imageUrl
  };
  db.doc(`/posts/${request.params.postId}`)
  .get()
  .then((doc) => {
    if (!doc.exists) {
      return response.status(404).json({ error: 'Post not found' });
    }
    return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
  })
  .then(() => {
    return db.collection('comments').add(newComment);
  })
  .then(() => {
    return response.json(newComment);
  })
  .catch((error) => {
    console.log(error);
    response.status(500).json({ error: 'Something went wrong' });
  });
}

  const deletePost = (request, response) => {
  const document = db.doc(`/posts/${request.params.postId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: 'Post not found' });
      }
      if (doc.data().userName !== request.user.userName) {
        return response.status(403).json({ error: 'Unauthorized' });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      return response.json({ message: 'Post deleted successfully' });
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};

module.exports = {
  addPost,
  commentOnPost,
  deletePost,
  getAllPosts,
  getPost
}