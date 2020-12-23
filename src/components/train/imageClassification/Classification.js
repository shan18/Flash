import React from 'react';
import { connect } from 'react-redux';

import { classifyConfig } from '../../../actions';
import ClassificationCreate from './ClassificationCreate';

class Classification extends React.Component {
  constructor(props) {
    super(props);

    this.configOptions = {
      modelTypes: ['MobileNet v2', 'ResNet34'],
      dataSplit: ['70 : 30', '80 : 20'],
      batchSizeLimit: { min: 16, max: 128 },
      numEpochsLimit: { min: 1, max: 10 },
      numClassesLimit: { min: 2, max: 10 },
      numImagesLimit: { min: 1, max: 5 },
      // sizeLimit: 20000000, // In bytes (20 MB)
      sizeLimit: 2000000,
    };

    this.currentConfig = {
      modelType: 'MobileNet v2',
      dataSplit: '70 : 30',
    };
  }

  componentDidMount() {
    this.props.classifyConfig({
      ...this.configOptions,
      currentConfig: this.currentConfig,
    });
  }

  render() {
    return (
      <div className="row mt-5">
        <div className="col-6 mx-auto">
          <ClassificationCreate
            loading={this.props.loadingForm.includes(this.constructor.name)}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ loadingForm }) => {
  return { loadingForm };
};

export default connect(mapStateToProps, { classifyConfig })(Classification);
