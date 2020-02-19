import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Home, Login, Signup} from './pages/index.js';
import Navbar from './components/Navbar'

class App extends Component {
  render() {
    return ( 
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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      </div>
    )
  }
}

export default App;
