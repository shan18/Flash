import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { submitInferenceData } from '../../actions';
import { renderFormField, renderSubmitButton } from '../../utils';

class InferenceForm extends React.Component {
  onSubmit = ({ inferenceInput }) => {
    if (typeof inferenceInput === 'object') {
      inferenceInput = inferenceInput[0];
    }
    this.props.submitInferenceData({
      formName: this.props.form,
      inferenceInput,
    });
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

const mapStateToProps = ({ loadingForm }) => {
  return { loadingForm };
};

export default connect(mapStateToProps, { submitInferenceData })(
  reduxForm({ form: 'inferenceForm', validate })(InferenceForm)
);
