import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { setTrainModelType, setTrainDataSplit } from '../../actions';
import { renderFormField } from '../../utils';
import HoverButtons from '../HoverButtons';

class TrainingConfigForm extends React.Component {
  changeModelType = modelType => {
    this.props.setTrainModelType({ taskName: this.props.taskName, modelType });
  };

  changeDataSplit = dataSplit => {
    this.props.setTrainDataSplit({ taskName: this.props.taskName, dataSplit });
  };

  render() {
    return (
      <form onSubmit={this.props.handleSubmit}>
        <div className="row">
          <div className="col mx-auto">
            <Field
              name="taskName"
              component={renderFormField}
              contentType="text"
              placeholder="Enter Task Name"
              formGroupClassName="text-center"
              label={<h4>Task Name</h4>}
            />
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-12 col-md-6 mr-auto text-center">
            <h4 className="mb-2">{this.props.configOptions.modelFieldTitle}</h4>
            <HoverButtons
              hoverButtons={this.props.configOptions.modelTypes}
              currentButtonValue={this.props.currentConfig.modelType}
              changeCurrentButtonValue={this.changeModelType}
              isSmall
            />
          </div>
          <div className="col-12 col-md-4 ml-auto mt-5 mt-md-0 text-center">
            <h4 className="mb-2">Dataset Split</h4>
            <HoverButtons
              hoverButtons={this.props.configOptions.dataSplit}
              currentButtonValue={this.props.currentConfig.dataSplit}
              changeCurrentButtonValue={this.changeDataSplit}
              isSmall
            />
          </div>
        </div>
        <div className="form-group row my-5">
          <div className="col-12 col-md-4 text-center">
            <Field
              name="criterion"
              component={renderFormField}
              contentType="dropdown"
              label="Loss Function"
              options={this.props.configOptions.criterions}
            />
          </div>
          <div className="col-12 col-md-4 my-3 my-md-0 text-center">
            <Field
              name="optimizer"
              component={renderFormField}
              contentType="dropdown"
              label="Optimizer"
              options={this.props.configOptions.optimizers}
            />
          </div>
          <div className="col-12 col-md-4 text-center">
            <Field
              name="learningRate"
              component={renderFormField}
              contentType="text"
              label="Learning Rate"
              placeholder="Enter LR"
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="col-12 col-md-6 text-center">
            <Field
              name="batchSize"
              component={renderFormField}
              contentType="text"
              label="Batch Size"
              placeholder="Enter batch size"
            />
          </div>
          <div className="col-12 col-md-6 mt-3 mt-md-0 text-center">
            <Field
              name="epochs"
              component={renderFormField}
              contentType="text"
              label="Epochs"
              placeholder="Enter number of epochs"
            />
          </div>
        </div>
      </form>
    );
  }
}

const validate = (formValues, { configOptions }) => {
  const errors = {};

  // Task Name
  if (!formValues.taskName) {
    errors.taskName = 'You must enter a task name';
  } else if (!/^[a-zA-Z0-9- ]+$/i.test(formValues.taskName)) {
    errors.taskName =
      'Task name can contain only alphabets, numbers, hyphens and spaces';
  }

  // Learning Rate
  const {
    learningRateLimit: { min: learningRateMin, max: learningRateMax },
  } = configOptions;
  if (!formValues.learningRate) {
    errors.learningRate = 'You must enter a learning rate';
  } else if (!/^[0-9]+(\.[0-9]+)*$/i.test(formValues.learningRate)) {
    errors.learningRate = 'Enter a valid value';
  } else if (
    formValues.learningRate < learningRateMin ||
    formValues.learningRate > learningRateMax
  ) {
    errors.learningRate = `Must be between ${learningRateMin} and ${learningRateMax}`;
  }

  // Batch Size
  const {
    batchSizeLimit: { min: batchSizeMin, max: batchSizeMax },
  } = configOptions;
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
  } = configOptions;
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

const mapStateToProps = (state, ownProps) => {
  const { configOptions, currentConfig } = state[ownProps.taskName];
  return { configOptions, currentConfig, initialValues: currentConfig };
};

export default connect(mapStateToProps, {
  setTrainModelType,
  setTrainDataSplit,
})(reduxForm({ validate })(TrainingConfigForm));
