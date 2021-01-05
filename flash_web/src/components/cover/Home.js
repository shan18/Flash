import React from 'react';

import CoverModal from './CoverModal';

class Home extends React.Component {
  state = {
    displayModal: false,
  };

  toggleModal = () => {
    this.setState({ displayModal: !this.state.displayModal });
  };

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
      </>
    );
  }
}

export default Home;
