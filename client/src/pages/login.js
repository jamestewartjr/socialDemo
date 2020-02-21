import React, { Component } from 'react'
import '../App.css'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types'
import Typography  from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import {Link} from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = (theme) => ({...theme})

class Login extends Component {
  constructor(){
    super();
    this.state = {
      email: '',
      password: '',
      loading: false,
      errors: {}
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({loading:true})
    // localStorage.setItem('SocialDemoFBToken', `Bearer ${response.data.token}`)
    const userData = {
      email: this.state.email,
      password: this.state.password,
    }

    axios.post('login', userData)
      .then( response => {
        console.log(response.data)
        this.setState({loading:false})
        this.props.history.push('/')
      })
      .catch( error => {
        console.log('login error', error)
        this.setState({
          errors: error,
          loading: false
        })
      })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const { classes } = this.props;
    const { errors, loading} = this.state;
    return ( 
      <Grid container className={classes.form}>
        <Grid item sm/>
        <Grid item sm>
          <Typography variant="h1" className={classes.pageTitle}>Login</Typography> 
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField 
              fullWidth
              id="email" 
              name="email"
              type="email"
              label="Email"
              className={classes.textField}
              helperText={errors.email}
              error={errors.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
            />
            <TextField 
              fullWidth
              id="password" 
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              helperText={errors.password}
              error={errors.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
            />
            {errors.general && (
              <Typography variant= "body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              className={classes.button}
              disabled={loading}
            > 
              Login
              {loading 
                && (<CircularProgress size={30} color="secondary" className={classes.progress}/> )
              }
            </Button>
            <br/>
            <small>
              Don't have an acccount? <Link to="/signup">Please signup!</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm/>

      </Grid>
    )
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Login);