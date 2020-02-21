import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Home, Login, Signup} from './pages/index.js';
import Navbar from './components/Navbar';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {createMuiTheme} from '@material-ui/core/styles/';
import themeFile from './util/theme'

const theme = createMuiTheme({themeFile})

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App"> 
          <Router>
            <Navbar/>
            <div className='container'>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={Signup} />
              </Switch>
            </div>
          </Router>
        </div>
      </MuiThemeProvider>

    )
  }
}

export default App;
