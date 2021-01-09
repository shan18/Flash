import _ from 'lodash';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { toast } from 'react-toastify';
import { MdError } from 'react-icons/md';

import { clearTrainData } from '../../../actions';
import { renderLoadingPage, renderSubmitButton } from '../../../utils';
import TrainingConfigForm from '../TrainingConfigForm';
import ClassificationModal from './ClassificationModal';

class ClassificationCreate extends React.Component {
  state = {
    displayModal: false,
  };

  toggleModal = () => {
    this.setState({ displayModal: !this.state.displayModal });
  };

  onModalDismiss = clear => {
    if (clear) {
      this.props.clearTrainData(this.props.taskName);
    }
    this.toggleModal();
  };

  checkNumClasses = () => {
    const {
      configOptions: {
        numClassesLimit: { min: numClassesLimitMin },
      },
      dataset,
    } = this.props;
    if (_.keys(dataset).length < numClassesLimitMin) {
      toast.dark(
        <div>
          <MdError size={25} color="yellow" />
          &nbsp; You need to create a minimum of {numClassesLimitMin} classes.
        </div>
      );
      return false;
    }
    return true;
  };

  checkNumImages = () => {
    const {
      configOptions: {
        numImagesLimit: { min: numImagesLimitMin },
      },
      dataset,
    } = this.props;

    const datasetValues = _.values(dataset);
    const datasetFailedClasses = _.sum(
      _.map(datasetValues, items => (items.length < numImagesLimitMin ? 0 : 1))
    );

    if (datasetValues.length !== datasetFailedClasses) {
      toast.dark(
        <div>
          <MdError size={25} color="yellow" />
          &nbsp; You need to upload atleast {numImagesLimitMin} images per
          class.
        </div>
      );
      return false;
    }
    return true;
  };

  onConfigSubmit = values => {
    if (this.checkNumClasses() && this.checkNumImages()) {
      const {
        dataset,
        currentConfig: { modelType, dataSplit },
      } = this.props;
      this.props.onSubmit({
        mode: 'training',
        taskType: this.props.taskName,
        ...values,
        batchSize: parseInt(values.batchSize),
        epochs: parseInt(values.epochs),
        modelType,
        dataSplit,
        dataset,
      });
    }
  };

  renderModal() {
    return (
      <>
        {this.state.displayModal ? (
          <ClassificationModal onDismiss={this.onModalDismiss} />
        ) : (
          ''
        )}
      </>
    );
  }

  render() {
    if (_.isEmpty(this.props.configOptions)) {
      return <>{renderLoadingPage('Loading')}</>;
    }

    return (
      <>
        <TrainingConfigForm
          taskName={this.props.taskName}
          form={this.props.formName}
          onSubmit={this.onConfigSubmit}
        />
        <div className="row my-5 text-center">
          <div className="col">
            <button
              className="btn btn-dark"
              onClick={event => {
                event.preventDefault();
                this.toggleModal();
              }}
              disabled={this.props.loadingForm.includes(this.props.formName)}
            >
              Create Dataset
            </button>
          </div>
        </div>
        <div className="row mt-5 text-center">
          <div className="col">
            {renderSubmitButton({
              loading: this.props.loadingForm.includes(this.props.formName),
              btnColor: 'success',
              originalText: 'Start Training!',
              loadingText: 'Uploading config...',
              onClick: () => this.props.dispatch(submit(this.props.formName)),
            })}
          </div>
        </div>
        {this.renderModal()}
      </>
    );
  }
}

const mapStateToProps = ({
  loadingForm,
  classification: { configOptions, currentConfig, dataset },
}) => {
  return { loadingForm, configOptions, currentConfig, dataset };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators({ clearTrainData }, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassificationCreate);
