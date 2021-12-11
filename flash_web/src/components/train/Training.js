import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import HoverButtons from '../HoverButtons';
import ImageClassification from './imageClassification/ImageClassification';
import SentimentAnalysis from './textClassification/SentimentAnalysis';
import FloatinHelp from '../FloatingHelp';

class Training extends React.Component {
  constructor(props) {
    super(props);

    this.hoverButtons = [
      {
        buttonValue: 'imageclassification',
        buttonText: 'Image Classification',
      },
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
      currentTask: 'imageclassification',
    };
  }

  changeCurrentTask = currentTask => {
    if (!(this.state.currentTask === currentTask)) {
      this.setState({ currentTask });
    }
  };

  renderCurrentTask() {
    if (this.state.currentTask === 'imageclassification') {
      return (
        <ImageClassification
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
      <Container>
        <Row>
          <Col>
            <h1 className="heading">Train a Model</h1>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <HoverButtons
              hoverButtons={this.hoverButtons}
              currentButtonValue={this.state.currentTask}
              changeCurrentButtonValue={this.changeCurrentTask}
            />
          </Col>
        </Row>
        {this.renderCurrentTask()}
        <FloatinHelp target="training" />
      </Container>
    );
  }
}

export default Training;
