import React, { Component } from 'react'
import '../App.css'
import withStyles from '@material-ui/core/styles/withStyles'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types'
import Typography  from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {Link} from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import {connect} from 'react-redux'
import {signupUser} from '../redux/actions/userActions'

const styles = (theme) => ({...theme.otherStyles})

class Signup extends Component {
  constructor(){
    super();
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      errors: {},
      userName: ''
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.UI.errors){
      this.setState({errors: nextProps.UI.errors})
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({loading:true})
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      userName: this.state.userName
    }
    this.props.signupUser(newUserData, this.props.history)
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const { classes, UI: {loading} } = this.props;
    const { errors } = this.state;
    return ( 
      <Grid container className={classes.form}>
        <Grid item sm/>
        <Grid item sm>
          <Typography variant="h1" className={classes.pageTitle}>Signup</Typography> 
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
            <TextField 
              fullWidth
              id="confirmPassword" 
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              className={classes.textField}
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              value={this.state.confirmPassword}
              onChange={this.handleChange}
            />
            <TextField 
              fullWidth
              id="userName" 
              name="userName"
              type="text"
              label="User Name"
              className={classes.textField}
              helperText={errors.userName}
              error={errors.userName ? true : false}
              value={this.state.userName}
              onChange={this.handleChange}
            />
            {errors.general && (
              <Typography variant= "body2" className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            
            <Button 
              fullWidth
              type="submit" 
              variant="contained" 
              color="primary" 
              className={classes.button}
              disabled={loading}
            > 
              Signup
              {loading 
                && (<CircularProgress size={30} color="secondary" className={classes.progress}/> )
              }
            </Button>
            <br/>
            <small>
              Already have an account? <Link to="/login">Please login!</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm/>
      </Grid>
    )
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired
}
 
const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
})

export default connect(mapStateToProps, {signupUser})(withStyles(styles)(Signup));