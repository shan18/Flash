import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { MdError } from 'react-icons/md';

import { classifyCurrentClass, classifyAddImages } from '../../../actions';
import ClassificationClassChoiceForm from './ClassificationClassChoiceForm';
import ClassificationDataUploadForm from './ClassificationDataUploadForm';
import ClassificationDataPreview from './ClassificationDataPreview';

class ClassificationDataset extends React.Component {
  onClassChoiceSubmit = values => {
    this.props.classifyCurrentClass(_.values(values)[0]);
  };

  onDataUploadSubmit = values => {
    // Fetch list of images
    let imagesList = Array.from(_.values(values)[0]);
    if (
      this.props.currentClassImgCount + imagesList.length >
      this.props.numImagesLimit.max
    ) {
      imagesList = imagesList.slice(
        0,
        this.props.numImagesLimit.max - this.props.currentClassImgCount
      );
    }

    // Obtain size
    let imagesListSize = 0;
    if (imagesList.length > 0) {
      imagesListSize = _.sumBy(['size'], _.partial(_.sumBy, imagesList));
    }
    if (this.props.currentSize + imagesListSize >= this.props.sizeLimit) {
      toast.info(
        <div>
          <MdError size={25} />
          &nbsp; Cannot upload images. Total size of the images for this class
          are exceeding {this.props.sizeLimit / 1000000} MB.
        </div>
      );
    } else {
      // Update redux store
      const imagesListUrl = _.map(imagesList, image =>
        URL.createObjectURL(image)
      );
      this.props.classifyAddImages(imagesListUrl, imagesListSize);
    }
  };

  render() {
    return (
      <React.Fragment>
        <h4>Images</h4>
        <small>
          Number of images for each class must be within the range{' '}
          {this.props.numImagesLimit.min} - {this.props.numImagesLimit.max}.
        </small>
        <br />
        <small>
          If you upload more than {this.props.numImagesLimit.max} images then
          only the first {this.props.numImagesLimit.max} images will be
          considered.
        </small>
        <br />
        <small>
          The total size of the images for each class must be less than 20 MB.
        </small>
        <ClassificationClassChoiceForm
          onSubmit={this.onClassChoiceSubmit}
          initialValues={{ classChoice: this.props.currentClass }}
        />
        <ClassificationDataUploadForm onSubmit={this.onDataUploadSubmit} />
        <ClassificationDataPreview />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  classification: {
    currentClass,
    dataset,
    classSize,
    configOptions: { numImagesLimit, sizeLimit },
  },
}) => {
  return {
    currentClass,
    numImagesLimit,
    sizeLimit,
    currentSize: classSize[currentClass],
    currentClassImgCount: dataset[currentClass]
      ? dataset[currentClass].length
      : 0,
  };
};

export default connect(mapStateToProps, {
  classifyCurrentClass,
  classifyAddImages,
})(ClassificationDataset);
