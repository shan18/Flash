import React from 'react';
import { connect } from 'react-redux';

import { setTrainConfig, clearTrainConfig } from '../../../actions';

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
    console.log(values);
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

  render() {
    return (
      <div className="row mt-5">
        <div className="col-6 mx-auto">Sentiment Analysis</div>
      </div>
    );
  }
}

export default connect(null, { setTrainConfig, clearTrainConfig })(
  SentimentAnalysis
);
