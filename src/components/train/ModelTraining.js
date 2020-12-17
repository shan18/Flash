import React from 'react';

import ImageClassification from './ImageClassification';
import SentimentAnalysis from './SentimentAnalysis';

class ModelTraining extends React.Component {
  state = {
    currentTask: 'classification',
  };

  changeCurrentTask(currentTask) {
    if (!(this.state.currentTask === currentTask)) {
      this.setState({ currentTask });
    }
  }

  renderCurrentTask() {
    if (this.state.currentTask === 'classification') {
      return <ImageClassification />;
    } else {
      return <SentimentAnalysis />;
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col">
            <h1 className="heading">Model Training</h1>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <h4 className="heading">Choose Task</h4>
            <button
              className={`btn border border-secondary btn-sm mr-2 btn-hover ${
                this.state.currentTask === 'classification' ? 'btn-info' : ''
              }`}
              onClick={() => {
                this.changeCurrentTask('classification');
              }}
            >
              Image Classification
            </button>
            <button
              className={`btn border border-secondary btn-sm ml-2 btn-hover ${
                this.state.currentTask === 'sentiment' ? 'btn-info' : ''
              }`}
              onClick={() => {
                this.changeCurrentTask('sentiment');
              }}
            >
              Sentiment Analysis
            </button>
          </div>
        </div>
        {this.renderCurrentTask()}
      </React.Fragment>
    );
  }
}

export default ModelTraining;
