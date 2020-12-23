import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { classifyCurrentClass, classifyAddImages } from '../../../actions';
import ClassificationClassChoiceForm from './ClassificationClassChoiceForm';
import ClassificationDataUploadForm from './ClassificationDataUploadForm';

class ClassificationDataset extends React.Component {
  onClassChoiceSubmit = values => {
    this.props.classifyCurrentClass(_.values(values)[0]);
  };

  onDataUploadSubmit = values => {
    const imagesList = Array.from(_.values(values)[0]);
    const imagesListUrl = _.map(imagesList, image =>
      URL.createObjectURL(image)
    );
    console.log(imagesList);
    if (imagesList.length > 0) {
      console.log(_.sumBy(['size'], _.partial(_.sumBy, imagesList)));
    }
    this.props.classifyAddImages(imagesListUrl);
  };

  render() {
    return (
      <React.Fragment>
        <h4>Images</h4>
        <small>
          Number of images for each class must be within the range{' '}
          {this.props.numImagesLimit.min} - {this.props.numImagesLimit.max}
        </small>
        <ClassificationClassChoiceForm onSubmit={this.onClassChoiceSubmit} />
        <ClassificationDataUploadForm onSubmit={this.onDataUploadSubmit} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  classification: {
    configOptions: { numImagesLimit },
  },
}) => {
  return { numImagesLimit };
};

export default connect(mapStateToProps, {
  classifyCurrentClass,
  classifyAddImages,
})(ClassificationDataset);
