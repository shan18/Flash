import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import FloatinHelp from '../FloatingHelp';

class Playground extends React.Component {
  constructor(props) {
    super(props);

    this.playItems = [
      {
        title: 'Human Pose Estimation',
        link: `/playground/humanposeestimation`,
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
            Don't have any models to train yet? Don't worry, we have trained
            some fun models for you to try out.
          </Col>
        </Row>
        <Row xs={1} md={2} lg={3}>
          {_.map(this.playItems, item => {
            return (
              <Col className="mb-5" key={item.link}>
                <Card className="card-hover rounded mx-auto">
                  <Card.Body className="text-center" as={Link} to={item.link}>
                    <Card.Title>{item.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
        <FloatinHelp target="training" />
      </Container>
    );
  }
}

export default Playground;
