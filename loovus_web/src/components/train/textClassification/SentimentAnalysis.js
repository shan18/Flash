import React from 'react';
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
      sizeLimit: 20000000, // In bytes (20 MB)
    };

    this.currentConfig = {
      modelType: 'LSTM',
      dataSplit: '70 : 30',
      optimizer: 'adam',
      criterion: 'bce',
      learningRate: 0.001,
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
        ...this.configOptions,
        ...this.props.trainConfigOptions,
        currentConfig: this.currentConfig,
      },
    });
  }

  componentWillUnmount() {
    this.props.clearTrainConfig(this.taskName);
  }

  renderModal() {
    return (
      <React.Fragment>
        {this.props.token ? (
          <TrainingSubmitModal onDismiss={this.onModalDismiss} />
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className="row mt-5">
          <div className="col-6 mx-auto">
            <SACreate
              taskName={this.taskName}
              formName={this.formName}
              onSubmit={this.onSubmit}
            />
          </div>
        </div>
        {this.renderModal()}
      </React.Fragment>
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
