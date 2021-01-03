import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { submit } from 'redux-form';

import { renderLoadingPage, renderSubmitButton } from '../../../utils';
import TrainingConfigForm from '../TrainingConfigForm';

class SACreate extends React.Component {
  onConfigSubmit = values => {
    const {
      currentConfig: { modelType, dataSplit },
    } = this.props;
    this.props.onSubmit({
      mode: 'training',
      taskType: 'classification',
      ...values,
      modelType,
      dataSplit,
    });
  };

  render() {
    if (_.isEmpty(this.props.configOptions)) {
      return <React.Fragment>{renderLoadingPage('Loading')}</React.Fragment>;
    }

    return (
      <React.Fragment>
        <TrainingConfigForm
          taskName={this.props.taskName}
          form={this.props.formName}
          onSubmit={this.onConfigSubmit}
        />
        <div className="row my-5 text-center">
          <div className="col">
            <button
              className="btn btn-dark"
              onClick={event => {
                event.preventDefault();
              }}
              disabled={this.props.loadingForm.includes(this.props.formName)}
            >
              Upload Dataset
            </button>
          </div>
        </div>
        <div className="row mt-5 text-center">
          <div className="col">
            {renderSubmitButton({
              loading: this.props.loadingForm.includes(this.props.formName),
              btnColor: 'success',
              originalText: 'Start Training!',
              loadingText: 'Uploading config...',
              onClick: () => this.props.dispatch(submit(this.props.formName)),
            })}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  loadingForm,
  sentimentAnalysis: { configOptions, currentConfig },
}) => {
  return { loadingForm, configOptions, currentConfig };
};

export default connect(mapStateToProps)(SACreate);
