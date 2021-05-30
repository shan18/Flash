import React from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
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
          <Container className="h-100">
            <div className="d-flex h-100 text-center align-items-center">
              <div className="w-100 text-white">
                <h1 style={{ fontSize: this.props.isMobile ? '3rem' : '5rem' }}>
                  <Image
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
          </Container>
        </header>
        {this.renderModal()}
      </>
    );
  }
}

const mapStateToProps = ({ isMobile }) => {
  return { isMobile };
};

export default connect(mapStateToProps, { setHome, clearHome })(Home);
