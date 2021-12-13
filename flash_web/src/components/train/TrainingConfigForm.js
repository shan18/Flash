import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { setTrainModelType, setTrainDataSplit } from '../../actions';
import { renderFormField } from '../../utils';
import HoverButtons from '../HoverButtons';

class TrainingConfigForm extends React.Component {
  state = {
    reduceLrOnPlateau: false,
    stepLr: false,
  };

  toggleReduceLr = () => {
    this.setState({ reduceLrOnPlateau: !this.state.reduceLrOnPlateau });
  };

  toggleStepLr = () => {
    this.setState({ stepLr: !this.state.stepLr });
  };

  changeModelType = modelType => {
    this.props.setTrainModelType({ taskName: this.props.taskName, modelType });
  };

  changeDataSplit = dataSplit => {
    this.props.setTrainDataSplit({ taskName: this.props.taskName, dataSplit });
  };

  render() {
    const {
      batchSizeLimit: { min: batchSizeMin, max: batchSizeMax },
      numEpochsLimit: { min: numEpochsMin, max: numEpochsMax },
    } = this.props.configOptions;
    return (
      <Form onSubmit={this.props.handleSubmit}>
        <Row>
          <Col className="mx-auto">
            <Field
              name="taskName"
              component={renderFormField}
              contentType="text"
              placeholder="Enter Task Name"
              formGroupClassName="text-center"
              label={<h4>Task Name</h4>}
            />
          </Col>
        </Row>
        <Row className="mt-5">
          <Col xs={12} md={6} className="mr-auto text-center">
            <h4 className="mb-2">{this.props.configOptions.modelFieldTitle}</h4>
            <HoverButtons
              hoverButtons={this.props.configOptions.modelTypes}
              currentButtonValue={this.props.currentConfig.modelType}
              changeCurrentButtonValue={this.changeModelType}
              isSmall
            />
          </Col>
          <Col xs={12} md={4} className="ml-auto mt-5 mt-md-0 text-center">
            <h4 className="mb-2">Dataset Split</h4>
            <HoverButtons
              hoverButtons={this.props.configOptions.dataSplit}
              currentButtonValue={this.props.currentConfig.dataSplit}
              changeCurrentButtonValue={this.changeDataSplit}
              isSmall
            />
          </Col>
        </Row>
        {this.props.configOptions.pretrainDatasets ? (
          <Row className="mt-5">
            <Col xs={12} md={6} className="mx-auto text-center">
              <Field
                name="pretrainDataset"
                component={renderFormField}
                contentType="dropdown"
                label="Transfer Learning"
                options={this.props.configOptions.pretrainDatasets}
              />
            </Col>
          </Row>
        ) : (
          ''
        )}
        <Row className="mt-5">
          <Col xs={12} md={6} className="mx-auto text-center">
            <h4 className="mb-2">Callbacks</h4>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col xs={12} md={6} className="mx-auto text-center">
            <Field
              name="reduceLrOnPlateau"
              component={renderFormField}
              contentType="switch"
              label="Reduce LR on Plateau"
              onChange={() => this.toggleReduceLr()}
            />
          </Col>
        </Row>
        {this.state.reduceLrOnPlateau ? (
          <Form.Group as={Row} className="mt-1 mb-5">
            <Col xs={12} md={4} className="text-center">
              <Field
                name="reduceLrOnPlateauPatience"
                component={renderFormField}
                contentType="text"
                label="Patience"
                placeholder="Enter Patience"
              />
            </Col>
            <Col xs={12} md={4} className="my-3 my-md-0 text-center">
              <Field
                name="reduceLrOnPlateauFactor"
                component={renderFormField}
                contentType="text"
                label="Factor"
                placeholder="Enter Factor"
              />
            </Col>
            <Col xs={12} md={4} className="text-center">
              <Field
                name="reduceLrOnPlateauMinLr"
                component={renderFormField}
                contentType="text"
                label="Minimum LR"
                placeholder="Enter Min LR"
              />
            </Col>
          </Form.Group>
        ) : (
          ''
        )}
        <Row className="mt-2">
          <Col xs={12} md={6} className="mx-auto text-center">
            <Field
              name="stepLr"
              component={renderFormField}
              contentType="switch"
              label="Step LR"
              onChange={() => this.toggleStepLr()}
            />
          </Col>
        </Row>
        {this.state.stepLr ? (
          <Form.Group as={Row} className="mt-1 mb-5">
            <Col xs={12} md={6} className="text-center">
              <Field
                name="stepLrStepSize"
                component={renderFormField}
                contentType="text"
                label="Step Size"
                placeholder="Enter Step Size"
              />
            </Col>
            <Col xs={12} md={6} className="my-3 my-md-0 text-center">
              <Field
                name="stepLrGamma"
                component={renderFormField}
                contentType="text"
                label="Gamma"
                placeholder="Enter Gamma"
              />
            </Col>
          </Form.Group>
        ) : (
          ''
        )}
        <Row className="mt-5">
          <Col xs={12} md={6} className="mx-auto text-center">
            <h4 className="mb-2">Hyperparameters</h4>
          </Col>
        </Row>
        <Form.Group as={Row} className="my-5">
          <Col xs={12} md={6} className="text-center">
            <Field
              name="optimizer"
              component={renderFormField}
              contentType="dropdown"
              label="Optimizer"
              options={this.props.configOptions.optimizers}
            />
          </Col>
          <Col xs={12} md={6} className="mt-3 mt-md-0 text-center">
            <Field
              name="learningRate"
              component={renderFormField}
              contentType="text"
              label="Learning Rate"
              placeholder="Enter LR"
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Col xs={12} md={6} className="text-center">
            <Field
              name="batchSize"
              component={renderFormField}
              contentType="text"
              label="Batch Size"
              placeholder={`Range: ${batchSizeMin} - ${batchSizeMax}`}
            />
          </Col>
          <Col xs={12} md={6} className="mt-3 mt-md-0 text-center">
            <Field
              name="epochs"
              component={renderFormField}
              contentType="text"
              label="Epochs"
              placeholder={`Range: ${numEpochsMin} - ${numEpochsMax}`}
            />
          </Col>
        </Form.Group>
      </Form>
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

  // Reduce LR on Plateau
  if (formValues.reduceLrOnPlateau) {
    const {
      reduceLrOnPlateauLimit: {
        factor: factorLimit,
        patience: patienceLimit,
        minLr: minLrLimit,
      },
      stepLrLimit: { stepSize: stepSizeLimit, gamma: gammaLimit },
    } = configOptions;

    // Reduce LR On Plateau - Patience
    if (!formValues.reduceLrOnPlateauPatience) {
      errors.reduceLrOnPlateauPatience = 'Enter a value';
    } else if (!/^[0-9]+$/i.test(formValues.reduceLrOnPlateauPatience)) {
      errors.reduceLrOnPlateauPatience = 'Must be an integer';
    } else if (
      formValues.reduceLrOnPlateauPatience < patienceLimit.min ||
      formValues.reduceLrOnPlateauPatience > patienceLimit.max
    ) {
      errors.reduceLrOnPlateauPatience = `Must be between ${patienceLimit.min} and ${patienceLimit.max}`;
    }

    // Reduce LR On Plateau - Factor
    if (!formValues.reduceLrOnPlateauFactor) {
      errors.reduceLrOnPlateauFactor = 'Enter a value';
    } else if (
      !/^[0-9]+(\.[0-9]+)*$/i.test(formValues.reduceLrOnPlateauFactor)
    ) {
      errors.reduceLrOnPlateauFactor = 'Enter a valid value';
    } else if (
      formValues.reduceLrOnPlateauFactor < factorLimit.min ||
      formValues.reduceLrOnPlateauFactor > factorLimit.max
    ) {
      errors.reduceLrOnPlateauFactor = `Must be between ${factorLimit.min} and ${factorLimit.max}`;
    }

    // Reduce LR On Plateau - Min LR
    if (!formValues.reduceLrOnPlateauMinLr) {
      errors.reduceLrOnPlateauMinLr = 'Enter a value';
    } else if (
      !/^[0-9]+(\.[0-9]+)*$/i.test(formValues.reduceLrOnPlateauMinLr)
    ) {
      errors.reduceLrOnPlateauMinLr = 'Enter a valid value';
    } else if (formValues.reduceLrOnPlateauMinLr < minLrLimit) {
      errors.reduceLrOnPlateauMinLr = `Minimum value is ${minLrLimit}`;
    }

    // Step LR - Step Size
    if (!formValues.stepLrStepSize) {
      errors.stepLrStepSize = 'Enter a value';
    } else if (!/^[0-9]+$/i.test(formValues.stepLrStepSize)) {
      errors.stepLrStepSize = 'Must be an integer';
    } else if (
      formValues.stepLrStepSize < stepSizeLimit.min ||
      formValues.stepLrStepSize > stepSizeLimit.max
    ) {
      errors.stepLrStepSize = `Must be between ${stepSizeLimit.min} and ${stepSizeLimit.max}`;
    }

    // Step LR - Gamma
    if (!formValues.stepLrGamma) {
      errors.stepLrGamma = 'Enter a value';
    } else if (!/^[0-9]+(\.[0-9]+)*$/i.test(formValues.stepLrGamma)) {
      errors.stepLrGamma = 'Enter a valid value';
    } else if (
      formValues.stepLrGamma < gammaLimit.min ||
      formValues.stepLrGamma > gammaLimit.max
    ) {
      errors.stepLrGamma = `Must be between ${gammaLimit.min} and ${gammaLimit.max}`;
    }
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
