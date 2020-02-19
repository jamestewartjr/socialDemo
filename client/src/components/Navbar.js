import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';

class Navbar extends Component { 
  render() {
    return (
      <AppBar>
        <Toolbar>
          <Button color="inherit"> Home </Button>
          <Button color="inherit"> Signup </Button>
          <Button color="inherit"> Login </Button>

        </Toolbar>
      </AppBar>
    )
  }
}

export default Navbar;