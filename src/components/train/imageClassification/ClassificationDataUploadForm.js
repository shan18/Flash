import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { ImUpload3 } from 'react-icons/im';

import { renderFormField } from '../../../utils';

class ClassificationDataUploadForm extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.currentClass ? (
          <form>
            <div className="row mt-3">
              <div className="col-5 mx-auto">
                <ImUpload3 size={30} className="mb-3" />
                <Field
                  name="classImages"
                  component={renderFormField}
                  contentType="file"
                  label="Choose File"
                  accept="image/jpeg,image/png"
                  multiple
                />
              </div>
            </div>
          </form>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ classification: { currentClass } }) => {
  return { currentClass };
};

export default connect(mapStateToProps)(
  reduxForm({
    form: 'classificationDataUploadForm',
    onChange: (values, dispatch, props) => {
      props.submit();
    },
  })(ClassificationDataUploadForm)
);
