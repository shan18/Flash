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

  renderAccuracy() {
    return (
      <div className="row my-5">
        <div className="col-12 col-md-2" />
        <div className="col-12 col-md-3 my-auto text-center">
          <div className="ml-auto">
            <h5>Accuracy</h5>
            <h5>
              {(
                this.props.accuracy * (this.props.accuracy < 1 ? 100 : 1)
              ).toFixed(2)}{' '}
              %
            </h5>
          </div>
        </div>
        <div className="col-12 col-md-6 mt-5 mt-md-0">
          <h5 className="text-center mb-3">Accuracy Change Plot</h5>
          <div
            className="card shadow bg-white rounded mx-auto"
            style={{ width: '28rem' }}
          >
            <img
              src={`data:image/jpeg;base64,${this.props.accuracyPlot}`}
              className="card-img-top"
              alt="sentiment analysis example dataset preview"
            />
          </div>
        </div>
        <div className="col-12 col-md-1" />
      </div>
    );
  }

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
        <div className="col-12 col-lg-6 mt-5 mt-md-4 mr-auto text-center">
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
      <>
        <div className="row mb-4">
          <div className="col-12">
            <h4 className="text-center">
              {this.props.taskType === 'classification'
                ? 'Image Classification'
                : 'Sentiment Analysis'}
            </h4>
          </div>
        </div>
        {this.renderAccuracy()}
        <div className="row mb-4">
          <div className="col-11 col-lg-6 mx-auto">
            <InferenceForm
              onSubmit={this.onSubmit}
              taskName={this.props.taskName}
              field={this.fieldValues}
            />
          </div>
        </div>
        {this.props.prediction ? this.renderOutput() : ''}
      </>
    );
  }
}

const mapStateToProps = ({
  inference: { taskType, prediction, accuracy, accuracyPlot },
}) => {
  return { taskType, prediction, accuracy, accuracyPlot };
};

export default connect(mapStateToProps)(TaskDisplay);
