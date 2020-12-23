import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { renderFormField } from '../../../utils';

class ClassificationClassChoiceForm extends React.Component {
  render() {
    const { classList } = this.props;
    return (
      <form>
        <div className="row mt-3">
          <div className="col-8 mx-auto">
            <Field
              name="classChoice"
              component={renderFormField}
              contentType="dropdown"
              options={{
                default: 'Choose a class...',
                ..._.zipObject(classList, classList),
              }}
            />
          </div>
        </div>
      </form>
    );
  }
}

const mapStateToProps = ({ classification: { dataset } }) => {
  return { classList: _.keys(dataset) };
};

export default connect(mapStateToProps)(
  reduxForm({
    form: 'classificationClassChoiceForm',
    enableReinitialize: true,
    onChange: (values, dispatch, props) => {
      props.submit();
    },
  })(ClassificationClassChoiceForm)
);
