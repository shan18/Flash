import React from 'react';

import HoverButtons from '../HoverButtons';
import Classification from './imageClassification/Classification';
import SentimentAnalysis from './textClassification/SentimentAnalysis';
import FloatinHelp from '../FloatingHelp';

class Training extends React.Component {
  constructor(props) {
    super(props);

    this.hoverButtons = [
      { buttonValue: 'classification', buttonText: 'Image Classification' },
      { buttonValue: 'sentiment', buttonText: 'Sentiment Analysis' },
    ];

    this.trainConfigOptions = {
      dataSplit: ['70 : 30', '80 : 20'],
      batchSizeLimit: { min: 1, max: 256 },
      numEpochsLimit: { min: 1, max: 20 },
      optimizers: { adam: 'Adam', sgd: 'SGD' },
      learningRateLimit: { min: 1e-5, max: 2 },
      reduceLrOnPlateauLimit: {
        factor: { min: 0.01, max: 0.5 },
        patience: { min: 1, max: 20 },
        minLr: 1e-5,
      },
    };

    this.currentTrainConfig = {
      reduceLrOnPlateau: false,
      reduceLrOnPlateauPatience: 5,
      reduceLrOnPlateauFactor: 0.1,
      reduceLrOnPlateauMinLr: 1e-5,
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
      return (
        <Classification
          trainConfigOptions={this.trainConfigOptions}
          currentTrainConfig={this.currentTrainConfig}
        />
      );
    } else {
      return (
        <SentimentAnalysis
          trainConfigOptions={this.trainConfigOptions}
          currentTrainConfig={this.currentTrainConfig}
        />
      );
    }
  }

  render() {
    return (
      <div className="container">
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
        <FloatinHelp target="training" />
      </div>
    );
  }
}

export default Training;
