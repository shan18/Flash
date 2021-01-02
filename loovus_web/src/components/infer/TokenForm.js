import React from 'react';
import { connect } from 'react-redux';
import { Field, reset, reduxForm } from 'redux-form';
import { MdDelete } from 'react-icons/md';

import { submitInferenceToken, clearInferenceConfig } from '../../actions';
import { renderFormField, renderSubmitButton } from '../../utils';

class TokenForm extends React.Component {
  onSubmit = values => {
    if (this.props.token) {
      this.props.clearInferenceConfig();
      this.props.dispatch(reset(this.props.form));
    } else {
      this.props.submitInferenceToken({
        formName: this.props.form,
        token: values.token,
      });
    }
  };

  render() {
    return (
      <div className="row mb-1 mt-3 py-5">
        <div className="col-10 col-md-6 mx-auto">
          {this.props.token ? (
            <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
              <Field
                name="token"
                component={renderFormField}
                contentType="text"
                label="Token"
                textAppend={<MdDelete />}
                enableAppendSubmit
                isFixed
              />
            </form>
          ) : (
            <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
              <Field
                name="token"
                component={renderFormField}
                contentType="text"
                placeholder="Enter Token"
              />
              <div className="row mt-3">
                <div className="col text-right">
                  {renderSubmitButton({
                    loading: this.props.loadingForm.includes(this.props.form),
                    originalText: 'Validate Token',
                    loadingText: 'Validating...',
                  })}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }
}

const validate = formValues => {
  const errors = {};

  if (!formValues.token) {
    errors.token = 'You must enter a token';
  } else if (!/^[a-zA-Z0-9- ]+$/i.test(formValues.token)) {
    errors.token = 'Invalid token';
  }

  return errors;
};

const mapStateToProps = ({ loadingForm, inference: { token } }) => {
  return { loadingForm, token };
};

export default connect(mapStateToProps, {
  submitInferenceToken,
  clearInferenceConfig,
})(reduxForm({ form: 'tokenForm', validate })(TokenForm));
