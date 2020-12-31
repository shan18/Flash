import React from 'react';
import { connect } from 'react-redux';
import { Field, reset, reduxForm } from 'redux-form';
import { MdDelete } from 'react-icons/md';

import { setInferenceToken, clearInferenceToken } from '../../actions';
import { renderFormField, renderSubmitButton } from '../../utils';

class TokenForm extends React.Component {
  onSubmit = values => {
    if (this.props.token) {
      this.props.clearInferenceToken();
      this.props.dispatch(reset(this.props.form));
    } else {
      this.props.setInferenceToken(values.token);
    }
  };

  render() {
    return (
      <div className="row my-5 py-5">
        <div className="col-10 col-md-6 mx-auto">
          {this.props.token ? (
            <form
              onSubmit={this.props.handleSubmit(this.onSubmit)}
              className="my-2"
            >
              <Field
                name="token"
                component={renderFormField}
                contentType="text"
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

const mapStateToProps = ({ loadingForm, inference: { token } }) => {
  return { loadingForm, token };
};

export default connect(mapStateToProps, {
  setInferenceToken,
  clearInferenceToken,
})(reduxForm({ form: 'tokenForm' })(TokenForm));
