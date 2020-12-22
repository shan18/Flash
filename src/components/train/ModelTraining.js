import React from 'react';

import HoverButtons from '../HoverButtons';
import Classification from './imageClassification/Classification';
import SentimentAnalysis from './SentimentAnalysis';

class ModelTraining extends React.Component {
  constructor(props) {
    super(props);

    this.hoverButtons = [
      { buttonValue: 'classification', buttonText: 'Image Classification' },
      { buttonValue: 'sentiment', buttonText: 'Sentiment Analysis' },
    ];

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
      return <Classification />;
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
            <HoverButtons
              hoverButtons={this.hoverButtons}
              currentButtonValue={this.state.currentTask}
              changeCurrentButtonValue={this.changeCurrentTask}
            />
          </div>
        </div>
        {this.renderCurrentTask()}
      </React.Fragment>
    );
  }
}

export default ModelTraining;
