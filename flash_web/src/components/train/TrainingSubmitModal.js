import React from 'react';
import ReactDOM from 'react-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';

import '../../styles/Modal.css';

class TrainingSubmitModal extends React.Component {
  renderContent() {
    return (
      <Row className="my-4">
        <Col xs={12} className="mb-4">
          Your dataset and model configuration has been successfully uploaded to
          the server for training.
        </Col>
        <Col xs={12}>
          <h5>
            <b>Token:</b>&nbsp;&nbsp;&nbsp; {this.props.token}
          </h5>
        </Col>
        <Col xs={12} className="mt-4">
          Please copy and save the token provided above. It will be required for
          testing the model on the inference page.
        </Col>
        <Col xs={12} className="mt-4">
          Note:
          <ul>
            <li>
              The model shall be trained and available for inference in 3-15
              minutes depending upon the size of your dataset.
            </li>
            <li>
              Trained models are available for testing only upto <b>2 hours</b>{' '}
              starting from the point when they are made available for
              inference.
            </li>
          </ul>
        </Col>
      </Row>
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
          <Row>
            <Col className="text-right">
              <Button
                variant="success"
                className="mr-2"
                onClick={() => this.props.onDismiss(true)}
              >
                Dismiss
              </Button>
            </Col>
          </Row>
        </div>
      </div>,
      document.querySelector('#modal') // places the modal inside the container with id 'modal' in index.html
    );
  }
}

const mapStateToProps = ({ serverConfig: { token } }) => {
  return { token };
};

export default connect(mapStateToProps)(TrainingSubmitModal);
