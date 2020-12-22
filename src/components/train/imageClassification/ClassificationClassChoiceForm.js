import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { renderDropdownInputGroup } from '../../../utils';

class ClassificationClassChoiceForm extends React.Component {
  onSubmit(values) {
    console.log(values);
  }

  render() {
    const classList = _.keys(this.props.classification);
    return (
      <form onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}>
        <div className="row mt-3">
          <div className="col-6 mx-auto">
            <Field
              name="classDropdown"
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

const mapStateToProps = ({ classification }) => {
  return { classification };
};

export default connect(mapStateToProps)(
  reduxForm({
    form: 'classificationClassChoiceForm',
    onChange: (values, dispatch, props, previousValues) => {
      console.log(values);
      console.log(props);
      console.log(previousValues);
      // props.submit();
    },
  })(ClassificationClassChoiceForm)
);
