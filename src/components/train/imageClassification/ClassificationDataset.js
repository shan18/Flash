import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { renderDropdownInputGroup } from '../../../utils';

class ClassificationDataset extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.handleSubmit(values => console.log(values))}>
        <Field
          name="classDropdown"
          component={renderDropdownInputGroup}
          contentType="dropdown"
          options={{ default: 'Choose a class...' }}
        />
      </form>
    );
  }
}

const mapStateToProps = ({ imageClassification }) => {
  return { imageClassification };
};

export default connect(mapStateToProps)(
  reduxForm({ form: 'classificationDataset' })(ClassificationDataset)
);
