import _ from 'lodash';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { renderFormField } from '../../../utils';

class IcClassChoiceForm extends React.Component {
  render() {
    const { classList } = this.props;
    return (
      <Form>
        <Row className="mt-3">
          <Col xs={8} className="mx-auto">
            <Field
              name="classChoice"
              component={renderFormField}
              contentType="dropdown"
              options={{
                default: 'Choose a class...',
                ..._.zipObject(classList, classList),
              }}
            />
          </Col>
        </Row>
      </Form>
    );
  }
}

const mapStateToProps = ({ imageClassification: { dataset } }) => {
  return { classList: _.keys(dataset) };
};

export default connect(mapStateToProps)(
  reduxForm({
    form: 'icClassChoiceForm',
    enableReinitialize: true,
    onChange: (values, dispatch, props) => {
      props.submit();
    },
  })(IcClassChoiceForm)
);
