import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import '../../styles/Modal.css';

class Modal extends React.Component {
  renderContent() {
    return (
      <div className="card-deck px-5">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Train a model</h5>
            <p className="card-text">
              Train an Image Classifier or a Sentiment Analysis Model.
            </p>
            <Link to="#">
              <button className="btn btn-primary">Train</button>
            </Link>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Test an existing model</h5>
            <p className="card-text">Test your existing model</p>
            <Link to="#">
              <button className="btn btn-primary">Test</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(
      <div className="modal-container" onClick={this.props.onDismiss}>
        <div className="modal-body" onClick={e => e.stopPropagation()}>
          <h3 className="text-center">Choose</h3>
          <hr className="w-100" />
          {this.renderContent()}
          <hr className="w-100" />
          <div className="row">
            <div className="col text-right">
              <button
                className="btn btn-primary mr-2"
                onClick={this.props.onDismiss}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.querySelector('#modal') // places the modal inside the container with id 'modal' in index.html
    );
  }
}

export default Modal;
