import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';

import { submitPlaygroundForm } from '../../actions';
import PlaygroundForm from './PlaygroundForm';

class HumanPoseEstimation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      objectURL: null,
    };

    this.formName = 'humanposeestimation';
    this.submitButtonRef = React.createRef();
  }

  onSubmit = ({ formData, objectURL }) => {
    this.props.submitPlaygroundForm({
      url: 'https://wrad2oqme9.execute-api.ap-south-1.amazonaws.com/dev/pose',
      formName: this.formName,
      formData,
    });

    this.setState({ objectURL: objectURL.image });
  };

  renderOutput() {
    if (this.props.play.name === this.formName) {
      return (
        <Row className="mt-5">
          <Col xs={12} md={6} className="mt-4 ml-auto text-center">
            <Card className="mx-auto" style={{ width: '20rem' }}>
              <Card.Img variant="top" src={this.state.objectURL} alt="source" />
              <Card.Body>
                <Card.Text>Input Image</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} className="mt-4 ml-auto text-center">
            <Card className="mx-auto" style={{ width: '20rem' }}>
              <Card.Img
                variant="top"
                src={`data:image/jpeg;base64,${this.props.play.data.data}`}
                alt="pose"
              />
              <Card.Body>
                <Card.Text>Pose Estimated Image</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      );
    }
    return '';
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1 className="heading">Human Pose Estimation</h1>
          </Col>
        </Row>

        <Row className="my-4">
          <Col xs={11} lg={6} className="mx-auto">
            <p align="justify">
              This model uses a ResNet-50 model pre-trained on the MPII dataset
              to predict and draw pose of a human in the input image.
            </p>
          </Col>
        </Row>

        <Row className="my-4">
          <Col xs={11} lg={6} className="mx-auto">
            <PlaygroundForm
              form={this.formName}
              onSubmit={this.onSubmit}
              fields={[
                {
                  name: 'image',
                  contentType: 'fileField',
                  label: 'Upload Face Image',
                },
              ]}
            />
          </Col>
        </Row>

        {this.renderOutput()}
      </Container>
    );
  }
}

const mapStateToProps = ({ play }) => {
  return { play };
};

export default connect(mapStateToProps, { submitPlaygroundForm })(
  HumanPoseEstimation
);
