import React from 'react';
import ReactDOM from 'react-dom';

import ClassificationClassList from './ClassificationClassList';
import ClassificationDataset from './ClassificationDataset';
import '../../../styles/Modal.css';

class ClassificationModal extends React.Component {
  renderContent() {
    return (
      <div className="row">
        <div className="col col-md-4 text-center">
          <ClassificationClassList />
        </div>
        <div className="col col-md-8 text-center">
          <ClassificationDataset />
        </div>
      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(
      <div className="modal-container" onClick={() => this.props.onDismiss()}>
        <div
          className="modal-body"
          style={{ width: '60%', maxHeight: 'calc(100vh - 20vh)' }}
          onClick={e => e.stopPropagation()}
        >
          <h3 className="text-center">Upload Dataset</h3>
          <hr className="w-100" />
          {this.renderContent()}
          <hr className="w-100" />
          <div className="row">
            <div className="col text-right">
              <button
                className="btn btn-success mr-2"
                onClick={() => {
                  this.props.onDismiss();
                }}
              >
                Save Dataset
              </button>
              <button
                className="btn btn-warning mr-2"
                onClick={() => this.props.onDismiss(true)}
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

export default ClassificationModal;
