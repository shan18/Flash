import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import FloatinHelp from '../FloatingHelp';

class Playground extends React.Component {
  constructor(props) {
    super(props);

    this.playItems = [
      {
        title: 'Human Pose Estimation',
        link: `/playground/humanposeestimation`,
        media: '/assets/media/humanPoseEstimation.gif',
      },
      {
        title: 'Neural Style Transfer',
        link: `/playground/styletransfer`,
        media: '/assets/media/neuralStyleTransfer.gif',
      },
    ];
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1 className="heading">Playground</h1>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col xs={11} className="mx-auto text-center">
            <p style={{ fontSize: '1.7vh' }}>
              Don't have any models to train yet? Don't worry, we have trained
              some fun models for you to try out. The models are already trained
              and deployed so that you can directly perform inference on them.
            </p>
          </Col>
        </Row>
        <Row xs={1} md={2} lg={3}>
          {_.map(this.playItems, item => {
            return (
              <Col className="mb-5 mt-5 mx-auto" key={item.link}>
                <Card
                  className="card-hover rounded mx-auto"
                  as={Link}
                  to={item.link}
                  style={{ textDecoration: 'none', color: 'black' }}
                >
                  <Card.Img
                    variant="top"
                    src={`${process.env.PUBLIC_URL}${item.media}`}
                    alt={item.title}
                  />
                  <Card.Body className="text-center">
                    <Card.Title>{item.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
        <FloatinHelp target="playground" />
      </Container>
    );
  }
}

export default Playground;
