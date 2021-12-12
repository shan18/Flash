import React from 'react';
import ReactDOM from 'react-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';

import ICClassList from './ICClassList';
import ICDataset from './ICDataset';
import '../../../styles/Modal.css';

class IcModal extends React.Component {
  renderContent() {
    return (
      <Row>
        <Col xs={12} md={4} className="text-center">
          <ICClassList />
        </Col>
        <Col
          xs={12}
          md={8}
          className={`${this.props.isMobile ? 'mt-5' : ''} text-center`}
        >
          <ICDataset />
        </Col>
      </Row>
    );
  }

  render() {
    return ReactDOM.createPortal(
      <div className="modal-container" onClick={() => this.props.onDismiss()}>
        <div
          className="modal-body"
          style={{
            width: this.props.isMobile ? '90%' : '60%',
            maxHeight: 'calc(100vh - 20vh)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <h3 className="text-center">Upload Dataset</h3>
          <hr className="w-100" />
          {this.renderContent()}
          <hr className="w-100" />
          <Row>
            <Col className="text-right">
              <Button
                variant="success"
                className="mr-2"
                onClick={() => {
                  this.props.onDismiss();
                }}
              >
                Save Dataset
              </Button>
              <Button
                variant="warning"
                className="mr-2"
                onClick={() => this.props.onDismiss(true)}
              >
                Go Back
              </Button>
            </Col>
          </Row>
        </div>
      </div>,
      document.querySelector('#modal') // places the modal inside the container with id 'modal' in index.html
    );
  }
}

const mapStateToProps = ({ isMobile }) => {
  return { isMobile };
};

export default connect(mapStateToProps)(IcModal);
