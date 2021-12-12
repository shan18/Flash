import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { reduxForm } from 'redux-form';
import { ImUpload3 } from 'react-icons/im';

import { renderFormField } from '../../../utils';
import FormFileField from '../../FormFileField';

class TCDataUploadForm extends React.Component {
  render() {
    return (
      <Row className="text-center">
        <Col xs={12} className="mb-4">
          <h4>Upload Dataset</h4>
        </Col>
        <Col md={8} className="mx-auto">
          <Form>
            <ImUpload3 size={30} className="mb-3" />
            <FormFileField
              taskName={this.props.taskName}
              fieldConfig={{
                name: 'tcCsvData',
                component: renderFormField,
                contentType: 'file',
                label: 'Choose File',
                acceptFileFormat: '.csv, text/csv',
              }}
            />
          </Form>
        </Col>
      </Row>
    );
  }
}

export default reduxForm({
  form: 'tcDataUploadForm',
  onChange: (values, dispatch, props) => {
    props.submit();
  },
})(TCDataUploadForm);
