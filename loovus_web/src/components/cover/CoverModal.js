import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import '../../styles/Modal.css';

class CoverModal extends React.Component {
  constructor(props) {
    super(props);

    this.modalCardContent = [
      {
        title: 'Training',
        targetUrl: '/training',
        contentImage: `${process.env.PUBLIC_URL}/assets/training.gif`,
        contentText: (
          <>
            Train an{' '}
            <mark>
              <b>Image Classification</b>
            </mark>{' '}
            or{' '}
            <mark>
              <b>Sentiment Analysis</b>
            </mark>{' '}
            model on your custom dataset.
          </>
        ),
        buttonText: 'Choose Task',
      },
      {
        title: 'Inference',
        targetUrl: '/inference',
        contentImage: `${process.env.PUBLIC_URL}/assets/inference.gif`,
        contentText:
          'Already trained a model on Loovus? Choose this to test your model.',
        buttonText: 'Test Model',
      },
    ];
  }

  renderCardContent({
    title,
    targetUrl,
    contentImage,
    contentText,
    buttonText,
  }) {
    return (
      <div className="card card-hover" key={targetUrl}>
        <img
          src={contentImage}
          className="card-img-top"
          style={{ height: '24vh' }}
          alt="source"
        />
        <div className="card-body">
          <h4 className="card-title text-center">{title}</h4>
          <p className="card-text my-4">{contentText}</p>
          <div className="text-center">
            <Link to={targetUrl}>
              <button className="btn btn-info">{buttonText}</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  renderContent() {
    return (
      <div className="card-deck px-0 px-md-5">
        {_.map(this.modalCardContent, item => {
          return this.renderCardContent(item);
        })}
      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(
      <div className="modal-container" onClick={this.props.onDismiss}>
        <div className="modal-body" onClick={e => e.stopPropagation()}>
          <h3 className="text-center">Get Started</h3>
          <hr className="w-100 mb-4" />
          {this.renderContent()}
          <hr className="w-100 mt-4" />
          <div className="row">
            <div className="col text-right">
              <button
                className="btn btn-warning mr-2"
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

export default CoverModal;
