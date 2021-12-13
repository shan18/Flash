import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';

import {
  clearTrainToken,
  setTrainConfig,
  submitTrainRequest,
  clearTrainData,
  clearTrainConfig,
} from '../../../actions';
import history from '../../../history';
import ICCreate from './ICCreate';
import TrainingSubmitModal from '../TrainingSubmitModal';

class ImageClassification extends React.Component {
  constructor(props) {
    super(props);

    this.taskName = 'imageClassification';
    this.formName = `${this.taskName}ConfigForm`;

    this.configOptions = {
      modelTypes: ['ResNet18', 'ResNet34', 'MobileNet v2'],
      modelFieldTitle: 'Model',
      numClassesLimit: { min: 2, max: 10 },
      numImagesLimit: { min: 10, max: 100 },
      batchSizeLimit: { min: 1, max: 32 },
      numEpochsLimit: { min: 1, max: 10 },
      sizeLimit: 10000000, // In bytes (10 MB)
    };

    this.currentConfig = {
      modelType: 'ResNet18',
      dataSplit: '70 : 30',
      optimizer: 'sgd',
      learningRate: 0.01,
      ...this.props.currentTrainConfig,
    };
  }

  onSubmit = values => {
    // Send values to server
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
          <Col xs={9} md={4} className="mx-auto">
            <Card className="mx-auto mt-4">
              <Card.Img
                variant="top"
                as="video"
                playsInline="playsinline"
                autoPlay="autoplay"
                muted="muted"
              >
                <source
                  src={`${process.env.PUBLIC_URL}/assets/media/imageClassification.mp4`}
                  type="video/mp4"
                />
              </Card.Img>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col xs={6} className="mx-auto">
            <ICCreate
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
  submitTrainRequest,
  clearTrainData,
  clearTrainConfig,
})(ImageClassification);
