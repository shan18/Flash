import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { submitInferenceData, clearInferencePrediction } from '../../actions';
import {
  renderFormField,
  renderSubmitButton,
  convertFileToBase64,
  removeImageBase64Header,
} from '../../utils';

class InferenceForm extends React.Component {
  onSubmit = async ({ inferenceInput }) => {
    this.props.clearInferencePrediction();

    // Get input type
    let inputType = 'text';
    if (typeof inferenceInput === 'object') {
      inputType = 'image';
      inferenceInput = await convertFileToBase64(inferenceInput[0]);
    }

    // If input is non-text, convert it to base64 string
    this.props.submitInferenceData({
      formName: this.props.form,
      formInput: {
        token: this.props.token,
        input:
          inputType === 'image'
            ? removeImageBase64Header(inferenceInput)
            : inferenceInput,
      },
    });

    // Send input to props for display
    this.props.onSubmit(inferenceInput);
  };

  render() {
    const { contentType, label, options, acceptFileFormat } = this.props.field;
    return (
      <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <Field
          name="inferenceInput"
          key="inferenceInput"
          component={renderFormField}
          contentType={contentType}
          label={label}
          options={options}
          acceptFileFormat={acceptFileFormat}
          onChange={() => console.log('jfdlsk')}
        />
        <div className="row mt-3">
          <div className="col mx-auto">
            {renderSubmitButton({
              loading: this.props.loadingForm.includes(this.props.form),
              originalText: 'Predict',
              loadingText: 'Predicting...',
            })}
          </div>
          <div className="col-12">
            <small>
              *The model might take more than 1 min to give predictions for the
              first time.
            </small>
          </div>
        </div>
      </form>
    );
  }
}

const validate = formValues => {
  const errors = {};

  if (!formValues.inferenceInput) {
    errors.inferenceInput = 'This field cannot be empty';
  }

  return errors;
};

const mapStateToProps = ({ loadingForm, inference: { token } }) => {
  return { loadingForm, token };
};

export default connect(mapStateToProps, {
  submitInferenceData,
  clearInferencePrediction,
})(reduxForm({ form: 'inferenceForm', validate })(InferenceForm));
