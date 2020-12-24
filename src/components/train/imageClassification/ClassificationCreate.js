import _ from 'lodash';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { submit } from 'redux-form';

import { classifyClear } from '../../../actions';
import { renderLoadingPage, renderSubmitButton } from '../../../utils';
import ClassificationConfigForm from './ClassificationConfigForm';
import ClassificationModal from './ClassificationModal';

const classificationConfigFormName = 'classificationConfigForm';

class ClassificationCreate extends React.Component {
  state = {
    displayModal: false,
  };

  toggleModal = () => {
    this.setState({ displayModal: !this.state.displayModal });
  };

  onModalDismiss = clear => {
    if (clear) {
      this.props.classifyClear();
    }
    this.toggleModal();
  };

  onConfigSubmit = values => {
    const { modelType, dataSplit } = this.props;
    console.log({
      ...values,
      modelType,
      dataSplit,
    });
  };

  renderModal() {
    return (
      <React.Fragment>
        {this.state.displayModal ? (
          <ClassificationModal onDismiss={this.onModalDismiss} />
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }

  render() {
    if (_.isEmpty(this.props.configOptions)) {
      return <React.Fragment>{renderLoadingPage('Loading')}</React.Fragment>;
    }

    return (
      <React.Fragment>
        <ClassificationConfigForm
          form={classificationConfigFormName}
          onSubmit={this.onConfigSubmit}
        />
        <div className="row my-5 text-center">
          <div className="col">
            <button
              className="btn btn-dark"
              onClick={event => {
                event.preventDefault();
                this.toggleModal();
              }}
            >
              Upload Dataset
            </button>
          </div>
        </div>
        <div className="row mt-5 text-center">
          <div className="col">
            {renderSubmitButton({
              loading: this.props.loading,
              btnColor: 'success',
              originalText: 'Start Training!',
              loadingText: 'Uploading config...',
              onClick: () =>
                this.props.dispatch(submit(classificationConfigFormName)),
            })}
          </div>
        </div>
        {this.renderModal()}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  classification: {
    configOptions,
    currentConfig: { modelType, dataSplit },
  },
}) => {
  return { configOptions, modelType, dataSplit };
};

const mapDispatchToProps = dispatch => {
  return { dispatch, ...bindActionCreators({ classifyClear }, dispatch) };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassificationCreate);
