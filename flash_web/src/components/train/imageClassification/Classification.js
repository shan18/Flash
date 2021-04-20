import React from 'react';
import { connect } from 'react-redux';

import {
  clearTrainToken,
  setTrainConfig,
  submitTrainRequest,
  clearTrainData,
  clearTrainConfig,
} from '../../../actions';
import history from '../../../history';
import ClassificationCreate from './ClassificationCreate';
import TrainingSubmitModal from '../TrainingSubmitModal';

class Classification extends React.Component {
  constructor(props) {
    super(props);

    this.taskName = 'classification';
    this.formName = `${this.taskName}ConfigForm`;

    this.configOptions = {
      modelTypes: ['MobileNet v2', 'ResNet34'],
      modelFieldTitle: 'Model',
      numClassesLimit: { min: 2, max: 10 },
      numImagesLimit: { min: 10, max: 100 },
      batchSizeLimit: { min: 1, max: 32 },
      numEpochsLimit: { min: 1, max: 10 },
      sizeLimit: 10000000, // In bytes (10 MB)
    };

    this.currentConfig = {
      modelType: 'MobileNet v2',
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
        <div className="row">
          <div className="col-9 col-md-4 mx-auto">
            <div className="card mx-auto mt-4">
              <video
                playsInline="playsinline"
                autoPlay="autoplay"
                muted="muted"
                className="card-img-top"
              >
                <source
                  src={`${process.env.PUBLIC_URL}/assets/media/imageClassification.mp4`}
                  type="video/mp4"
                />
              </video>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-6 mx-auto">
            <ClassificationCreate
              taskName={this.taskName}
              formName={this.formName}
              onSubmit={this.onSubmit}
            />
          </div>
        </div>
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
})(Classification);
