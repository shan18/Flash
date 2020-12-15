import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import history from '../history';
import Home from './Home';
import Footer from './Footer';

import '../styles/App.css';

class App extends React.Component {
  render() {
    return (
      <div className="page-container">
        <div className="content-wrap">
          <Router history={history}>
            <div className="container">
              <Switch>
                <Route path="/" exact component={Home} />
              </Switch>
            </div>
          </Router>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
