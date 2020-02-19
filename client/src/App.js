import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './pages/home.js';

class App extends Component {
  render() {
    return ( 
      <div className="App"> 
      <Router>
        <Switch>
          <Route path="/" component={Home} />
          {/* <Route path="/" component={home} />
          <Route path="/" component={home} /> */}

        </Switch>
      </Router>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
        <h1>Home</h1>

      </div>
    )
  }
}

export default App;
