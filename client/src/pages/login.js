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
import { connect} from 'react-redux'
import {loginUser} from '../redux/actions/userActions'

const styles = (theme) => ({...theme.otherStyles})

class Login extends Component {
  constructor(){
    super();
    this.state = {
      email: '',
      password: '',
      errors: {}
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.UI.errors){
      this.setState({errors: nextProps.UI.errors})
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
    }
    this.props.loginUser(userData, this.props.history)
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const { classes, UI: {loading }} = this.props;
    const { errors} = this.state;
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
              fullWidth
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
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
})

const mapActionsToProps = {
  loginUser
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Login));