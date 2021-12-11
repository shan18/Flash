import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { MdError } from 'react-icons/md';

import { icCurrentClass, icAddImages } from '../../../actions';
import { convertFileToBase64, removeFileBase64Header } from '../../../utils';
import ICClassChoiceForm from './ICClassChoiceForm';
import ICDataUploadForm from './ICDataUploadForm';
import ICDataPreview from './ICDataPreview';

class ICDataset extends React.Component {
  onClassChoiceSubmit = values => {
    this.props.icCurrentClass(_.values(values)[0]);
  };

  fileListToArray = fileList => {
    let imagesList = Array.from(fileList);
    if (
      this.props.currentClassImgCount + imagesList.length >
      this.props.numImagesLimit.max
    ) {
      imagesList = imagesList.slice(
        0,
        this.props.numImagesLimit.max - this.props.currentClassImgCount
      );
    }
    return imagesList;
  };

  getImageListSize = imagesList => {
    let imagesListSize = 0;
    if (imagesList.length > 0) {
      imagesListSize = _.sumBy(['size'], _.partial(_.sumBy, imagesList));
    }
    return imagesListSize;
  };

  imageListToBase64 = async imagesList => {
    let imagesListPreview = [];
    for (let i = 0; i < imagesList.length; i++) {
      imagesListPreview.push(await convertFileToBase64(imagesList[i]));
    }
    return imagesListPreview;
  };

  removeBase64HeaderFromImageList = imagesList => {
    return _.map(imagesList, image => {
      return removeFileBase64Header(image);
    });
  };

  onDataUploadSubmit = async values => {
    // Fetch list of images
    let imagesList = this.fileListToArray(_.values(values)[0]);

    // Obtain size
    const imagesListSize = this.getImageListSize(imagesList);

    if (this.props.currentSize + imagesListSize >= this.props.sizeLimit) {
      toast.info(
        <div>
          <MdError size={25} />
          &nbsp; Cannot upload images. Total size of the images for this class
          are exceeding {this.props.sizeLimit / 1000000} MB.
        </div>
      );
    } else if (imagesList.length > 0) {
      // Get base64 string of each image
      const imagesListPreview = await this.imageListToBase64(imagesList);

      // Remove base64 header from image for backend support
      imagesList = this.removeBase64HeaderFromImageList(imagesListPreview);

      // Update redux store
      this.props.icAddImages({
        imagesList,
        imagesListPreview,
        imagesListSize,
      });
    }
  };

  render() {
    return (
      <>
        <h4>Images</h4>
        <small>
          Number of images for each class must be within the{' '}
          <mark>
            <b>
              range {this.props.numImagesLimit.min} -{' '}
              {this.props.numImagesLimit.max}
            </b>
          </mark>
          .
        </small>
        <br />
        <small>
          If you upload more than {this.props.numImagesLimit.max} images then
          only the{' '}
          <mark>
            <b>first {this.props.numImagesLimit.max} images</b>
          </mark>{' '}
          will be considered.
        </small>
        <br />
        <small>
          The total size of the images for each class must be{' '}
          <mark>
            <b>less than {this.props.sizeLimit / 1000000} MB</b>
          </mark>
          .
        </small>
        <ICClassChoiceForm
          onSubmit={this.onClassChoiceSubmit}
          initialValues={{ classChoice: this.props.currentClass }}
        />
        <ICDataUploadForm onSubmit={this.onDataUploadSubmit} />
        <ICDataPreview />
      </>
    );
  }
}

const mapStateToProps = ({
  imageclassification: {
    currentClass,
    dataset,
    datasetSize,
    configOptions: { numImagesLimit, sizeLimit },
  },
}) => {
  return {
    currentClass,
    numImagesLimit,
    sizeLimit,
    currentSize: datasetSize[currentClass],
    currentClassImgCount: dataset[currentClass]
      ? dataset[currentClass].length
      : 0,
  };
};

export default connect(mapStateToProps, {
  icCurrentClass,
  icAddImages,
})(ICDataset);
