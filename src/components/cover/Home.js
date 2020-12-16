import React from 'react';

import Modal from './Modal';

class Home extends React.Component {
  state = {
    displayModal: false,
  };

  toggleModal = () => {
    this.setState({ displayModal: !this.state.displayModal });
  };

  renderModal() {
    return (
      <React.Fragment>
        {this.state.displayModal ? <Modal onDismiss={this.toggleModal} /> : ''}
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col">
            <h1 className="heading">Home Page</h1>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <button
              className="btn border border-secondary mt-2"
              onClick={() => this.toggleModal()}
            >
              Get Started
            </button>
          </div>
        </div>
        {this.renderModal()}
      </React.Fragment>
    );
  }
}

export default Home;
