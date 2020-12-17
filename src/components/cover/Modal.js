import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import '../../styles/Modal.css';

class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.modalContent = [
      {
        title: 'Train a model',
        targetUrl: '/training',
        contentText: 'Train an Image Classifier or a Sentiment Analysis Model.',
        buttonText: 'Train',
      },
      {
        title: 'Test an existing model',
        targetUrl: '/inference',
        contentText: 'Test your existing model.',
        buttonText: 'Test',
      },
    ];
  }

  renderCardContent({ title, targetUrl, contentText, buttonText }) {
    return (
      <div className="card p-3" key={targetUrl}>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{contentText}</p>
          <Link to={targetUrl}>
            <button className="btn btn-primary">{buttonText}</button>
          </Link>
        </div>
      </div>
    );
  }

  renderContent() {
    return (
      <div className="card-deck px-5">
        {_.map(this.modalContent, item => {
          return this.renderCardContent(item);
        })}
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
