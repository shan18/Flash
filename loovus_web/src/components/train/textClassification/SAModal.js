import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { MdError } from 'react-icons/md';

import { saAddData } from '../../../actions';
import { convertFileToBase64, removeFileBase64Header } from '../../../utils';
import SADataUploadForm from './SADataUploadForm';
import '../../../styles/Modal.css';

class SAModal extends React.Component {
  onDataUploadSubmit = async values => {
    let csvData = values.saCsvData;
    if (csvData.length > 0) {
      csvData = csvData[0];
      if (csvData.size > this.props.sizeLimit) {
        toast.info(
          <div>
            <MdError size={25} />
            &nbsp; Cannot upload the file. Total size of the dataset is
            exceeding {this.props.sizeLimit / 1000000} MB.
          </div>
        );
      } else {
        csvData = removeFileBase64Header(await convertFileToBase64(csvData));
        this.props.saAddData(csvData);
      }
    }
  };

  renderContent() {
    return (
      <div className="row px-3">
        <div className="col text-justify">
          <p>
            Upload the dataset as a <b>CSV (Comma-Separated Values)</b> file
            with <b>two columns</b>:{' '}
            <mark>
              <b>input</b>
            </mark>{' '}
            and
            <mark>
              <b>label</b>
            </mark>
          </p>
          Column Description:
          <ul>
            <li>
              <mark>
                <b>input</b>
              </mark>
              : Contains input sentences
            </li>
            <li>
              <mark>
                <b>label</b>
              </mark>
              : Contains the label (sentiment) for the corresponding input
              sentences.
            </li>
          </ul>
          <p>
            NOTE: The size of the CSV file must be{' '}
            <b>less than {this.props.sizeLimit / 1000000} MB</b>
          </p>
          <br />
          <div className="row">
            <div className="col col-md-6">
              <h4 className="mb-3 text-center">Example Dataset Preview</h4>
              <div
                className="card shadow bg-white rounded mx-auto"
                style={{ width: '25rem' }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/assets/saDataPreview.png`}
                  className="card-img-top"
                  alt="sentiment analysis example dataset preview"
                />
              </div>
            </div>
            <div className="col col-md-6">
              <SADataUploadForm onSubmit={this.onDataUploadSubmit} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return ReactDOM.createPortal(
      <div className="modal-container" onClick={() => this.props.onDismiss()}>
        <div
          className="modal-body"
          style={{ width: '50%', maxHeight: 'calc(100vh - 20vh)' }}
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

const mapStateToProps = ({
  sentimentAnalysis: {
    configOptions: { sizeLimit },
  },
}) => {
  return {
    sizeLimit,
  };
};

export default connect(mapStateToProps, { saAddData })(SAModal);
