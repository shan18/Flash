import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';

import {
  clearTrainToken,
  setTrainConfig,
  clearTrainConfig,
  submitTrainRequest,
  clearTrainData,
} from '../../../actions';
import history from '../../../history';
import SACreate from './SACreate';
import TrainingSubmitModal from '../TrainingSubmitModal';

class SentimentAnalysis extends React.Component {
  constructor(props) {
    super(props);

    this.taskName = 'sentimentAnalysis';
    this.formName = `${this.taskName}ConfigForm`;

    this.configOptions = {
      modelTypes: ['LSTM', 'GRU'],
      modelFieldTitle: 'RNN Type',
      numRows: 10000,
      sizeLimit: 1000000, // In bytes (1 MB)
    };

    this.currentConfig = {
      modelType: 'LSTM',
      dataSplit: '70 : 30',
      optimizer: 'adam',
      learningRate: 0.001,
      ...this.props.currentTrainConfig,
    };
  }

  onSubmit = values => {
    this.props.submitTrainRequest({
      formName: this.formName,
      trainConfig: values,
    });
  };

  onModalDismiss = () => {
    this.props.clearTrainData(this.taskName);
    this.props.clearTrainToken();
    history.push('/inference');
  };

  componentDidMount() {
    this.props.setTrainConfig({
      taskName: this.taskName,
      config: {
        ...this.props.trainConfigOptions,
        ...this.configOptions,
        currentConfig: this.currentConfig,
      },
    });
  }

  componentWillUnmount() {
    this.props.clearTrainConfig(this.taskName);
  }

  renderModal() {
    return (
      <>
        {this.props.token ? (
          <TrainingSubmitModal onDismiss={this.onModalDismiss} />
        ) : (
          ''
        )}
      </>
    );
  }

  render() {
    return (
      <>
        <Row>
          <Col xs={10} md={5} className="mx-auto">
            <Card className="mx-auto mt-4">
              <Card.Img
                variant="top"
                as="video"
                playsInline="playsinline"
                autoPlay="autoplay"
                muted="muted"
              >
                <source
                  src={`${process.env.PUBLIC_URL}/assets/media/sentimentAnalysis.mp4`}
                  type="video/mp4"
                />
              </Card.Img>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col xs={6} className="mx-auto">
            <SACreate
              taskName={this.taskName}
              formName={this.formName}
              onSubmit={this.onSubmit}
            />
          </Col>
        </Row>
        {this.renderModal()}
      </>
    );
  }
}

const mapStateToProps = ({ serverConfig: { token } }) => {
  return { token };
};

export default connect(mapStateToProps, {
  clearTrainToken,
  setTrainConfig,
  clearTrainConfig,
  submitTrainRequest,
  clearTrainData,
})(SentimentAnalysis);
