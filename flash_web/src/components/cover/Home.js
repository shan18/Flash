import React from 'react';
import { connect } from 'react-redux';

import { setHome, clearHome } from '../../actions';
import CoverModal from './CoverModal';
import '../../styles/Home.css';

class Home extends React.Component {
  state = {
    displayModal: false,
  };

  toggleModal = () => {
    this.setState({ displayModal: !this.state.displayModal });
  };

  componentDidMount() {
    this.props.setHome();
  }

  componentWillUnmount() {
    this.props.clearHome();
  }

  renderModal() {
    return (
      <>
        {this.state.displayModal ? (
          <CoverModal onDismiss={this.toggleModal} />
        ) : (
          ''
        )}
      </>
    );
  }

  render() {
    return (
      <>
        <header>
          <div className="overlay"></div>
          <video playsInline="playsinline" autoPlay="autoplay" muted="muted">
            <source
              src={`${process.env.PUBLIC_URL}/assets/media/home.mp4`}
              type="video/mp4"
            />
          </video>
          <div className="container h-100">
            <div className="d-flex h-100 text-center align-items-center">
              <div className="w-100 text-white">
                <h1 className="display-3">
                  <img
                    src={`${process.env.PUBLIC_URL}/flash.svg`}
                    style={{ height: '10vh' }}
                    alt="flash-logo"
                  />{' '}
                  F L A S H
                </h1>
                <button
                  className="btn btn-outline-light mt-5"
                  onClick={() => this.toggleModal()}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </header>
        {this.renderModal()}
      </>
    );
  }
}

export default connect(null, { setHome, clearHome })(Home);
