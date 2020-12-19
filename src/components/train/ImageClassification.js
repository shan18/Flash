import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import ImageClassificationForm from './ImageClassificationForm';

class ImageClassification extends React.Component {
  constructor(props) {
    super(props);

    this.configOptions = {
      modelTypes: ['MobileNet v2', 'ResNet34'],
      dataSplit: ['70 : 30', '80 : 20'],
      batchSizeLimit: { min: 16, max: 128 },
      numEpochsLimit: { min: 1, max: 10 },
      numClassesLimit: { min: 2, max: 10 },
      numImagesLimit: { min: 1, max: 5 },
    };
  }

  render() {
    return (
      <div className="row mt-5">
        <div className="col-6 mx-auto">
          <ImageClassificationForm
            configOptions={this.configOptions}
            loading={this.props.loadingForm.includes(this.constructor.name)}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return _.pick(state, 'loadingForm');
};

export default connect(mapStateToProps)(ImageClassification);
