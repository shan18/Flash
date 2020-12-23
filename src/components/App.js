import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import history from '../history';
import Home from './cover/Home';
import Navbar from './Navbar';
import Footer from './Footer';
import ModelTraining from './train/ModelTraining';
import ModelInference from './infer/ModelInference';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/App.css';

class App extends React.Component {
  render() {
    return (
      <div className="page-container">
        <div className="content-wrap">
          <ToastContainer
            position="top-center"
            autoClose={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
          />
          <Router history={history}>
            <Navbar />
            <div className="container">
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/training" exact component={ModelTraining} />
                <Route path="/inference" exact component={ModelInference} />
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
