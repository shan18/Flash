import React from 'react';
import { reduxForm } from 'redux-form';
import { ImUpload3 } from 'react-icons/im';

import { renderFormField } from '../../../utils';
import FormFileField from '../../FormFileField';

class SADataUploadForm extends React.Component {
  render() {
    return (
      <div className="row text-center">
        <div className="col-12 mb-4">
          <h4>Upload Dataset</h4>
        </div>
        <div className="col col-md-8 mx-auto">
          <form>
            <ImUpload3 size={30} className="mb-3" />
            <FormFileField
              taskName={this.props.taskName}
              fieldConfig={{
                name: 'saCsvData',
                component: renderFormField,
                contentType: 'file',
                label: 'Choose File',
                acceptFileFormat: '.csv, text/csv',
              }}
            />
          </form>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: 'saDataUploadForm',
  onChange: (values, dispatch, props) => {
    props.submit();
  },
})(SADataUploadForm);
