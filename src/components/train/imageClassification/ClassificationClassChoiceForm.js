import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { renderDropdownInputGroup } from '../../../utils';

class ClassificationClassChoiceForm extends React.Component {
  render() {
    const { classList } = this.props;
    return (
      <form>
        <div className="row mt-3">
          <div className="col-6 mx-auto">
            <Field
              name="classChoice"
              component={renderDropdownInputGroup}
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
    onChange: (values, dispatch, props) => {
      props.submit();
    },
  })(ClassificationClassChoiceForm)
);
