import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { renderFormField, renderSubmitButton } from '../../../utils';
import HoverButtons from '../../HoverButtons';
import ClassificationModal from './ClassificationModal';

class ClassificationForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentModelType: this.props.configOptions.modelTypes[0],
      currentDataSplit: this.props.configOptions.dataSplit[0],
      displayModal: false,
    };
  }

  toggleModal = () => {
    this.setState({ displayModal: !this.state.displayModal });
  };

  changeModelType = modelType => {
    if (!(this.state.currentModelType === modelType)) {
      this.setState({ currentModelType: modelType });
    }
  };

  changeDataSplit = dataSplit => {
    if (!(this.state.currentDataSplit === dataSplit)) {
      this.setState({ currentDataSplit: dataSplit });
    }
  };

  onSubmit(values) {
    values.modelType = this.state.currentModelType;
    values.dataSplit = this.state.currentDataSplit;
    console.log(values);
  }

  renderModal() {
    return (
      <React.Fragment>
        {this.state.displayModal ? (
          <ClassificationModal
            onDismiss={this.toggleModal}
            numImagesLimit={this.props.configOptions.numImagesLimit}
            numClassesLimit={this.props.configOptions.numClassesLimit}
          />
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}>
        <div className="form-group row mb-5">
          <div className="col">
            <Field
              name="taskName"
              component={renderFormField}
              contentType="text"
              placeholder="Enter Task Name"
            />
          </div>
        </div>
        <div className="row">
          <div className="col col-md-6 mr-auto text-center">
            <h4 className="mb-3">Model</h4>
            <HoverButtons
              hoverButtons={this.props.configOptions.modelTypes}
              currentButtonValue={this.state.currentModelType}
              changeCurrentButtonValue={this.changeModelType}
              isSmall
            />
          </div>
          <div className="col col-md-4 ml-auto text-center">
            <h4 className="mb-3">Dataset Split</h4>
            <HoverButtons
              hoverButtons={this.props.configOptions.dataSplit}
              currentButtonValue={this.state.currentDataSplit}
              changeCurrentButtonValue={this.changeDataSplit}
              isSmall
            />
          </div>
        </div>
        <div className="form-group row my-5">
          <div className="col mr-4 text-center">
            <Field
              name="batchSize"
              component={renderFormField}
              contentType="text"
              label="Batch Size"
              placeholder="Enter batch size"
            />
          </div>
          <div className="col ml-4 text-center">
            <Field
              name="epochs"
              component={renderFormField}
              contentType="text"
              label="Epochs"
              placeholder="Enter number of epochs"
            />
          </div>
        </div>
        <div className="row my-5 text-center">
          <div className="col">
            <button
              className="btn btn-dark"
              onClick={event => {
                event.preventDefault();
                this.toggleModal();
              }}
            >
              Upload Dataset
            </button>
          </div>
        </div>
        <div className="row mt-5 text-center">
          <div className="col">
            {renderSubmitButton({
              loading: this.props.loading,
              btnColor: 'success',
              originalText: 'Start Training!',
              loadingText: 'Uploading config...',
            })}
          </div>
        </div>
        {this.renderModal()}
      </form>
    );
  }
}

const validate = (formValues, props) => {
  const errors = {};

  // Task Name
  if (!formValues.taskName) {
    errors.taskName = 'You must enter a task name';
  } else if (!/^[a-zA-Z0-9- ]+$/i.test(formValues.taskName)) {
    errors.taskName =
      'Task name can contain only alphabets, numbers, hyphens and spaces';
  }

  // Batch Size
  const {
    batchSizeLimit: { min: batchSizeMin, max: batchSizeMax },
  } = props.configOptions;
  if (!formValues.batchSize) {
    errors.batchSize = 'You must enter a batch size';
  } else if (!/^[0-9]+$/i.test(formValues.batchSize)) {
    errors.batchSize = 'Batch size must be an integer';
  } else if (
    formValues.batchSize < batchSizeMin ||
    formValues.batchSize > batchSizeMax
  ) {
    errors.batchSize = `Must be between ${batchSizeMin} and ${batchSizeMax}`;
  }

  // Epochs
  const {
    numEpochsLimit: { min: numEpochsMin, max: numEpochsMax },
  } = props.configOptions;
  if (!formValues.epochs) {
    errors.epochs = 'You must enter the number of epochs';
  } else if (!/^[0-9]+$/i.test(formValues.epochs)) {
    errors.epochs = 'Number of epochs must be an integer';
  } else if (
    formValues.epochs < numEpochsMin ||
    formValues.epochs > numEpochsMax
  ) {
    errors.epochs = `Must be between ${numEpochsMin} and ${numEpochsMax}`;
  }

  return errors;
};

export default connect()(
  reduxForm({ form: 'classificationForm', validate })(ClassificationForm)
);
