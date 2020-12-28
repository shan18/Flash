import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import '../../../styles/Modal.css';

class ClassificationSubmitModal extends React.Component {
  renderContent() {
    return (
      <div className="row my-4">
        <div className="col-12 mb-4">
          Your dataset and model configuration has been successfully uploaded to
          the server for training.
        </div>
        <div className="col-12">
          <h5>
            <b>Token:</b>&nbsp;&nbsp;&nbsp; {this.props.token}
          </h5>
        </div>
        <div className="col-12 mt-4">
          Please copy and save the token provided above. It will be required for
          testing the model on the inference page.
        </div>
        <div className="col-12 mt-4">
          Note:
          <ul>
            <li>
              The model shall be trained and available for inference in 5
              minutes.
            </li>
            <li>
              Trained models are available for testing only upto one hour
              starting from the point when they are made available for
              inference.
            </li>
          </ul>
        </div>
      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(
      <div className="modal-container">
        <div
          className="modal-body"
          style={{ width: '40%', maxHeight: 'calc(100vh - 20vh)' }}
          onClick={e => e.stopPropagation()}
        >
          <h3 className="text-center">Upload Successful</h3>
          <hr className="w-100" />
          {this.renderContent()}
          <hr className="w-100" />
          <div className="row">
            <div className="col text-right">
              <button
                className="btn btn-success mr-2"
                onClick={() => this.props.onDismiss(true)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.querySelector('#modal') // places the modal inside the container with id 'modal' in index.html
    );
  }
}

const mapStateToProps = ({ serverConfig: { token } }) => {
  return { token };
};

export default connect(mapStateToProps)(ClassificationSubmitModal);
