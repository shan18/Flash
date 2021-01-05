import React from 'react';

import HoverButtons from '../HoverButtons';
import Classification from './imageClassification/Classification';
import SentimentAnalysis from './textClassification/SentimentAnalysis';

class Training extends React.Component {
  constructor(props) {
    super(props);

    this.hoverButtons = [
      { buttonValue: 'classification', buttonText: 'Image Classification' },
      { buttonValue: 'sentiment', buttonText: 'Sentiment Analysis' },
    ];

    this.trainConfigOptions = {
      dataSplit: ['70 : 30', '80 : 20'],
      batchSizeLimit: { min: 1, max: 128 },
      numEpochsLimit: { min: 1, max: 10 },
      optimizers: { adam: 'Adam', sgd: 'SGD' },
      learningRateLimit: { min: 1e-5, max: 2 },
      criterions: {
        crossEntropy: 'Cross Entropy',
        bce: 'Binary Cross Entropy',
        mse: 'Mean Squared Error',
      },
    };

    this.state = {
      currentTask: 'classification',
    };
  }

  changeCurrentTask = currentTask => {
    if (!(this.state.currentTask === currentTask)) {
      this.setState({ currentTask });
    }
  };

  renderCurrentTask() {
    if (this.state.currentTask === 'classification') {
      return <Classification trainConfigOptions={this.trainConfigOptions} />;
    } else {
      return <SentimentAnalysis trainConfigOptions={this.trainConfigOptions} />;
    }
  }

  render() {
    return (
      <>
        <div className="row">
          <div className="col">
            <h1 className="heading">Train a Model</h1>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <HoverButtons
              hoverButtons={this.hoverButtons}
              currentButtonValue={this.state.currentTask}
              changeCurrentButtonValue={this.changeCurrentTask}
            />
          </div>
        </div>
        {this.renderCurrentTask()}
      </>
    );
  }
}

export default Training;
