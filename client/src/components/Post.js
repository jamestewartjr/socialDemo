import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography  from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';

const styles = theme => ({
  card:{
    display:'flex',
    marginBottom: 20,
  },
  image:{
    minWidth: 200,
  },
  content: {
    padding: 25,
    objectFit: 'cover'
  }
})

class Post extends Component {
  render() {
    const {
      classes, 
      post: {
        body, 
        createdAt,
        userImages, 
        userName,
        postId, 
        likeCount, 
        commentCount
      }
    } = this.props;
    
    return (
      <Card className={classes.card}>
        <CardMedia 
          image={userImages} 
          title={`${userName} profile image`} 
          className={classes.image}/>
          <CardContent class={classes.content}>
            <Typography 
              variant= "h5" 
              component={Link} 
              to={`/users/${userName}`}
              color="primary"
            >{userName}</Typography>
            <Typography variant="body2" color="textSecondary">{createdAt}</Typography>
            <Typography variant="body1">{body}</Typography>
          </CardContent>
      </Card> 
    )
  }
}

export default withStyles(styles)(Post);