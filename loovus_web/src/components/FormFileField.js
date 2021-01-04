import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';

import { setFormFileFieldLabel } from '../actions';

class FormFileField extends React.Component {
  render() {
    return (
      <Field
        {..._.omit(this.props.fieldConfig, 'label', 'hideFilename')}
        label={
          this.props.fieldLabel
            ? this.props.fieldLabel
            : this.props.fieldConfig.label
        }
        onChange={event => {
          if (!this.props.hideFilename) {
            this.props.setFormFileFieldLabel({
              taskName: this.props.taskName,
              label: event.target.files[0].name,
            });
          }
        }}
      />
    );
  }
}

const mapStateToProps = ({ formFileField }, ownProps) => {
  return { fieldLabel: formFileField[ownProps.taskName] };
};

export default connect(mapStateToProps, { setFormFileFieldLabel })(
  FormFileField
);
