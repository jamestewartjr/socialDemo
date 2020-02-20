import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Link from 'react-router-dom/Link';

class Navbar extends Component { 
  render() {
    return (
      <AppBar>
        <Toolbar>
          <Button color="inherit" component={Link} to="/"> Home </Button>
          <Button color="inherit" component={Link} to="/signup"> Signup </Button>
          <Button color="inherit" component={Link} to="/login"> Login </Button>
        </Toolbar>
      </AppBar>
    )
  }
}

export default Navbar;