import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';

import InferenceForm from './InferenceForm';

class TaskDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inferenceInput: null,
    };

    // Set field values for form
    let fieldValues = {};
    if (this.props.taskType === 'classification') {
      fieldValues = {
        contentType: 'file',
        label: 'Upload Image',
        acceptFileFormat: 'image/jpeg,image/png',
      };
    } else {
      fieldValues = {
        contentType: 'text',
        label: 'Enter Text:',
      };
    }
    this.fieldValues = fieldValues;
  }

  onSubmit = inferenceInput => {
    if (this.props.taskType === 'classification') {
      this.setState({ inferenceInput: inferenceInput });
    } else {
      this.setState({ inferenceInput });
    }
  };

  renderAccuracy() {
    return (
      <>
        <h5 className="text-center mb-3">
          Best Accuracy:{' '}
          <mark>
            <b>
              {(
                this.props.accuracy * (this.props.accuracy < 1 ? 100 : 1)
              ).toFixed(2)}{' '}
              %
            </b>
          </mark>
        </h5>
        <Card
          className="shadow bg-white rounded mx-auto"
          style={{ height: this.props.isMobile ? '20vh' : '30vh' }}
        >
          <Card.Img
            variant="top"
            src={`data:image/jpeg;base64,${this.props.accuracyPlot}`}
            alt="sentiment analysis example dataset preview"
          />
        </Card>
      </>
    );
  }

  renderOutput() {
    return (
      <Row className="mb-5">
        <Col xs={12} className="mt-4">
          <h4 className="text-center">Results</h4>
        </Col>
        <Col xs={12} lg={6} className="mt-4 ml-auto text-center">
          <h4 className="text-center">Input</h4>
          {this.props.taskType === 'classification' ? (
            <Card
              className="mx-auto mt-3 shadow bg-white rounded"
              style={{ width: '20rem' }}
            >
              <Card.Img
                variant="top"
                src={this.state.inferenceInput}
                alt="source"
              />
            </Card>
          ) : (
            <Card className="mx-auto shadow p-3 bg-white rounded">
              <Card.Body>
                <Card.Text as="h5">{this.state.inferenceInput}</Card.Text>
              </Card.Body>
            </Card>
          )}
        </Col>
        <Col xs={12} lg={6} className="mt-5 mt-md-4 mr-auto text-center">
          <h4 className="text-center">Prediction</h4>
          <Card className="mx-auto mt-3 shadow bg-white rounded">
            <Card.Body>
              <Card.Title as="h5">{this.props.prediction}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <>
        <Row className="mb-5">
          <Col xs={12}>
            <h4 className="text-center">
              {this.props.taskType === 'classification'
                ? 'Image Classification'
                : 'Sentiment Analysis'}
            </h4>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col
            xs={12}
            md={5}
            className={`${this.props.isMobile ? 'mb-5' : ''} mx-auto`}
          >
            {this.renderAccuracy()}
          </Col>
          <Col
            xs={12}
            md={4}
            className={`${this.props.isMobile ? 'mt-5' : 'my-auto'} mx-auto`}
          >
            <InferenceForm
              onSubmit={this.onSubmit}
              taskName={this.props.taskName}
              field={this.fieldValues}
            />
          </Col>
        </Row>
        {this.props.prediction ? this.renderOutput() : ''}
      </>
    );
  }
}

const mapStateToProps = ({
  isMobile,
  inference: { taskType, prediction, accuracy, accuracyPlot },
}) => {
  return { isMobile, taskType, prediction, accuracy, accuracyPlot };
};

export default connect(mapStateToProps)(TaskDisplay);
