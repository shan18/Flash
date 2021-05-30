import _ from 'lodash';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import { toast } from 'react-toastify';
import { MdError } from 'react-icons/md';

import { clearTrainData } from '../../../actions';
import { renderLoadingPage, renderSubmitButton } from '../../../utils';
import TrainingConfigForm from '../TrainingConfigForm';
import SAModal from './SAModal';

class SACreate extends React.Component {
  state = {
    displayModal: false,
  };

  toggleModal = () => {
    this.setState({ displayModal: !this.state.displayModal });
  };

  onModalDismiss = clear => {
    if (clear) {
      this.props.clearTrainData(this.props.taskName);
    }
    this.toggleModal();
  };

  checkDataset = () => {
    if (!this.props.dataset) {
      toast.dark(
        <div>
          <MdError size={25} color="yellow" />
          &nbsp; Please upload a dataset.
        </div>
      );
      return false;
    }
    return true;
  };

  onConfigSubmit = values => {
    if (this.checkDataset()) {
      const {
        dataset,
        currentConfig: { modelType, dataSplit },
      } = this.props;
      this.props.onSubmit({
        mode: 'training',
        taskType: this.props.taskName,
        ...values,
        modelType,
        dataSplit,
        dataset,
      });
    }
  };

  renderModal() {
    return (
      <>
        {this.state.displayModal ? (
          <SAModal
            onDismiss={this.onModalDismiss}
            taskName={this.props.taskName}
          />
        ) : (
          ''
        )}
      </>
    );
  }

  render() {
    if (_.isEmpty(this.props.configOptions)) {
      return <>{renderLoadingPage('Loading')}</>;
    }

    return (
      <>
        <TrainingConfigForm
          taskName={this.props.taskName}
          form={this.props.formName}
          onSubmit={this.onConfigSubmit}
        />
        <Row className="my-5 text-center">
          <Col>
            <Button
              variant="dark"
              onClick={event => {
                event.preventDefault();
                this.toggleModal();
              }}
              disabled={this.props.loadingForm.includes(this.props.formName)}
            >
              Upload Dataset
            </Button>
          </Col>
        </Row>
        <Row className="mt-5 text-center">
          <Col>
            {renderSubmitButton({
              loading: this.props.loadingForm.includes(this.props.formName),
              btnColor: 'success',
              originalText: 'Start Training!',
              loadingText: 'Uploading config...',
              onClick: () => this.props.dispatch(submit(this.props.formName)),
            })}
          </Col>
        </Row>
        {this.renderModal()}
      </>
    );
  }
}

const mapStateToProps = ({
  loadingForm,
  sentimentAnalysis: { configOptions, currentConfig, dataset },
}) => {
  return { loadingForm, configOptions, currentConfig, dataset };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    ...bindActionCreators({ clearTrainData }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SACreate);
