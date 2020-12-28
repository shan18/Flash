import React from 'react';
import { connect } from 'react-redux';

import {
  clearTrainToken,
  classifyConfig,
  classifyTrain,
  classifyClear,
} from '../../../actions';
import history from '../../../history';
import ClassificationCreate from './ClassificationCreate';
import ClassificationSubmitModal from './ClassificationSubmitModal';

class Classification extends React.Component {
  constructor(props) {
    super(props);

    this.formName = 'classificationConfigForm';

    this.configOptions = {
      modelTypes: ['MobileNet v2', 'ResNet34'],
      dataSplit: ['70 : 30', '80 : 20'],
      batchSizeLimit: { min: 16, max: 128 },
      numEpochsLimit: { min: 1, max: 10 },
      numClassesLimit: { min: 2, max: 10 },
      numImagesLimit: { min: 10, max: 100 },
      sizeLimit: 20000000, // In bytes (20 MB)
    };

    this.currentConfig = {
      modelType: 'MobileNet v2',
      dataSplit: '70 : 30',
    };
  }

  onSubmit = values => {
    // Encode form values
    const formData = new FormData();
    formData.append('training_data', JSON.stringify(values));

    // Send values to server
    this.props.classifyTrain({
      formName: this.formName,
      formData,
    });
  };

  onModalDismiss = () => {
    this.props.classifyClear();
    this.props.clearTrainToken();
    history.push('/inference');
  };

  componentDidMount() {
    this.props.classifyConfig({
      ...this.configOptions,
      currentConfig: this.currentConfig,
    });
  }

  renderModal() {
    return (
      <React.Fragment>
        {this.props.token ? (
          <ClassificationSubmitModal onDismiss={this.onModalDismiss} />
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
            <ClassificationCreate
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
  classifyConfig,
  classifyTrain,
  classifyClear,
})(Classification);
