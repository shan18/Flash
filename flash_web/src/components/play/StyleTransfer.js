import _ from 'lodash';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';

import { submitPlaygroundForm } from '../../actions';
import PlaygroundForm from './PlaygroundForm';

class StyleTransfer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contentImageURL: null,
      styleImageURL: null,
    };

    this.formName = 'styletransfer';
    this.submitButtonRef = React.createRef();
    this.styleMap = {
      default: 'Choose...',
      1: ['Candy', `${process.env.PUBLIC_URL}/assets/styles/candy.jpg`],
      2: [
        'Composition VII',
        `${process.env.PUBLIC_URL}/assets/styles/composition_vii.jpg`,
      ],
      3: ['Feathers', `${process.env.PUBLIC_URL}/assets/styles/feathers.jpg`],
      4: ['La Muse', `${process.env.PUBLIC_URL}/assets/styles/la_muse.jpg`],
      5: ['Mosaic', `${process.env.PUBLIC_URL}/assets/styles/mosaic.jpg`],
      6: [
        'Starry Night',
        `${process.env.PUBLIC_URL}/assets/styles/starry_night.jpg`,
      ],
      7: [
        'The Scream',
        `${process.env.PUBLIC_URL}/assets/styles/the_scream.jpg`,
      ],
      8: ['Udnie', `${process.env.PUBLIC_URL}/assets/styles/udnie.jpg`],
      9: ['Wave', `${process.env.PUBLIC_URL}/assets/styles/wave.jpg`],
    };
  }

  onSubmit = ({ formData, objectURL, otherData }) => {
    this.props.submitPlaygroundForm({
      url: 'https://0g0e7jb2ni.execute-api.ap-south-1.amazonaws.com/dev/style',
      formName: this.formName,
      formData,
    });

    this.setState({
      contentImageURL: objectURL.content,
      styleImageURL: this.styleMap[otherData.style][1],
    });
  };

  renderOutputSmallDisplay() {
    return (
      <React.Fragment>
        <Col xs={12} className="d-block d-md-none mx-auto">
          <Row>
            <Col xs={12} className="mb-2">
              <h3 className="text-center">Inputs</h3>
            </Col>
            <Col xs={12}>
              <Card>
                <Card.Img
                  variant="top"
                  src={this.state.contentImageURL}
                  alt="content"
                />
                <Card.Body>
                  <Card.Text>Content Image</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} className="mt-2">
              <Card>
                <Card.Img
                  variant="top"
                  src={this.state.styleImageURL}
                  alt="style"
                />
                <Card.Body>
                  <Card.Text>Style Image</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={12} className="d-block d-md-none mx-auto">
          <Row>
            <Col xs={12} className="mt-5 mb-2">
              <h3 className="text-center">Output</h3>
            </Col>
          </Row>
          <Col xs={12}>
            <Card>
              <Card.Img
                variant="top"
                src={`data:image/jpeg;base64,${this.props.play.data.data}`}
                alt="styled"
              />
              <Card.Body>
                <Card.Text>Styled Content Image</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Col>
      </React.Fragment>
    );
  }

  renderOutputLargeDisplay() {
    return (
      <React.Fragment>
        <Col xs={7} className="d-none d-md-block ml-auto">
          <Row>
            <Col xs={12}>
              <h3 className="text-center">Inputs</h3>
            </Col>
            <Col xs={6}>
              <Card>
                <Card.Img
                  variant="top"
                  src={this.state.contentImageURL}
                  alt="content"
                />
                <Card.Body>
                  <Card.Text>Content Image</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6}>
              <Card>
                <Card.Img
                  variant="top"
                  src={this.state.styleImageURL}
                  alt="style"
                />
                <Card.Body>
                  <Card.Text>Style Image</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={1} className="d-none d-md-block" />
        <Col xs={4} className="d-none d-md-block mr-auto">
          <Row>
            <Col xs={12}>
              <h3 className="text-center">Output</h3>
            </Col>
          </Row>
          <Col xs={12}>
            <Card>
              <Card.Img
                variant="top"
                src={`data:image/jpeg;base64,${this.props.play.data.data}`}
                alt="styled"
              />
              <Card.Body>
                <Card.Text>Styled Content Image</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Col>
      </React.Fragment>
    );
  }

  renderOutput() {
    if (this.props.play.name === this.formName) {
      return (
        <Row className="mt-5">
          {this.renderOutputSmallDisplay()}
          {this.renderOutputLargeDisplay()}
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
            <h1 className="heading">Neural Style Transfer</h1>
          </Col>
        </Row>

        <Row className="my-4">
          <Col xs={11} lg={8} className="mx-auto">
            <p align="justify">
              This model uses MSG-Net to perform Neural Style Transfer. Upload
              your content image and select a style from one of the styles
              available below. The selected style will be applied to you content
              image.
            </p>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <h3 className="heading">Available Styles</h3>
          </Col>
          <Col>
            <Row xs={1} md={3} lg={5}>
              {_.map(_.omit(this.styleMap, 'default'), (value, key) => {
                return (
                  <Col className="mb-4" key={key}>
                    <Card>
                      <Card.Img variant="top" src={value[1]} alt={value[0]} />
                      <Card.Body>
                        <Card.Text>{value[0]}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>

        <Row className="my-5">
          <Col xs={11} lg={6} className="mx-auto">
            <PlaygroundForm
              form={this.formName}
              onSubmit={this.onSubmit}
              fields={[
                {
                  name: 'content',
                  contentType: 'fileField',
                  label: 'Upload Content Image',
                },
                {
                  name: 'style',
                  contentType: 'dropdown',
                  label: 'Select Style Image',
                  options: this.styleMap,
                },
              ]}
              buttonText={{
                originalText: 'Style',
                loadingText: 'Styling',
              }}
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
  StyleTransfer
);
