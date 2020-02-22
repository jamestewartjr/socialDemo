import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Home, Login, Signup} from './pages/index.js';
import Navbar from './components/Navbar';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {createMuiTheme} from '@material-ui/core/styles/';
import themeFile from './util/theme'

const theme = createMuiTheme({themeFile})

const token = localStorage.getItem('SocialDemoFBToken');
console.log(token)
// if (token) {
//   const decodedToken = jwtDecode(token);
//   if (decodedToken.exp * 1000 < Date.now()) {
//     store.dispatch(logoutUser());
//     window.location.href = '/login';
//   } else {
//     store.dispatch({ type: SET_AUTHENTICATED });
//     axios.defaults.headers.common['Authorization'] = token;
//     store.dispatch(getUserData());
//   }
// }

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
