import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import history from '../history';
import Home from './cover/Home';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import Training from './train/Training';
import Inference from './infer/Inference';
import Playground from './play/Playground';
import HumanPoseEstimation from './play/HumanPoseEstimation';
import StyleTransfer from './play/StyleTransfer';
import About from './About';
import { setMobile } from '../actions';

import 'react-toastify/dist/ReactToastify.css';
import '../styles/App.css';

class App extends React.Component {
  resize() {
    this.props.setMobile(window.innerWidth <= 767);
  }

  componentDidMount() {
    // Check for mobile view
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  render() {
    return (
      <Router history={history}>
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
              style={{ width: '40%' }}
            />
            <NavigationBar />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/training" exact component={Training} />
              <Route path="/inference" exact component={Inference} />
              <Route path="/playground" exact component={Playground} />
              <Route
                path="/playground/humanposeestimation"
                exact
                component={HumanPoseEstimation}
              />
              <Route
                path="/playground/styletransfer"
                exact
                component={StyleTransfer}
              />
              <Route path="/about" exact component={About} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default connect(null, { setMobile })(App);
