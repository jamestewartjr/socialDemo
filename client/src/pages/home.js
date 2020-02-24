import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
// import axios from 'axios';
import Post from '../components/Post'

class Home extends Component {
  state = {
    posts: null
  }
  
  // componentDidMount(){
  //   axios.get('/posts')
  //     .then( response => {
  //       console.log(response)
  //       this.setState({
  //         posts: response.data
  //       })
  //     })
  //     .catch( error => console.error(error))
  // }

  render() {
    let recentPosts = this.state.posts 
      ? (this.state.posts.map(post => 
          <Post key={post.postId} post={post}/>
        )) 
      : <p>Loading.... </p>
    return ( 
      <Grid container spacing={2}>

        <Grid item sm={8} xs={12}>
          {recentPosts}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>More</p>
        </Grid>
      </Grid>
    )
  }
}

export default Home;