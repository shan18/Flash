import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { clearInferenceToken } from '../../actions';
import { renderFormField, renderSubmitButton } from '../../utils';

class InferenceForm extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.token ? (
          <div className="row">
            <div className="col-6 mx-auto">Inference Form</div>
          </div>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ loadingForm, inference: { token } }) => {
  return { loadingForm, token };
};

export default connect(mapStateToProps, { clearInferenceToken })(
  reduxForm({ form: 'inferenceForm' })(InferenceForm)
);
