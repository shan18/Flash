import React from 'react';
import { connect } from 'react-redux';

import InferenceForm from './InferenceForm';

class TaskDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inferenceInput: null,
    };

    // Set field values for form
    let fieldValues = {};
    if (this.props.taskType === 'classification') {
      fieldValues = {
        contentType: 'file',
        label: 'Upload Image',
        acceptFileFormat: 'image/jpeg,image/png',
      };
    } else {
      fieldValues = {
        contentType: 'text',
        label: 'Enter Text:',
      };
    }
    this.fieldValues = fieldValues;
  }

  onSubmit = inferenceInput => {
    if (this.props.taskType === 'classification') {
      this.setState({ inferenceInput: inferenceInput });
    } else {
      this.setState({ inferenceInput });
    }
  };

  renderOutput() {
    return (
      <div className="row mt-5">
        <div className="col-12 col-lg-6 mt-4 ml-auto text-center">
          <h4 className="text-center">Input</h4>
          {this.props.taskType === 'classification' ? (
            <div
              className="card mx-auto mt-3 shadow bg-white rounded"
              style={{ width: '20rem' }}
            >
              <img
                src={this.state.inferenceInput}
                className="card-img-top"
                alt="source"
              />
            </div>
          ) : (
            <div className="card mx-auto shadow p-3 bg-white rounded">
              <div className="card-body">
                <h5 className="card-text">{this.state.inferenceInput}</h5>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-lg-6 mt-4 mr-auto text-center">
          <h4 className="text-center">Prediction</h4>
          <div className="card mx-auto mt-3 shadow bg-white rounded">
            <div className="card-body">
              <h5 className="card-title">{this.props.prediction}</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className="row my-4">
          <div className="col-11 col-lg-6 mx-auto">
            <InferenceForm onSubmit={this.onSubmit} field={this.fieldValues} />
          </div>
        </div>
        {this.props.prediction ? this.renderOutput() : ''}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ inference: { taskType, prediction } }) => {
  return { taskType, prediction };
};

export default connect(mapStateToProps)(TaskDisplay);
