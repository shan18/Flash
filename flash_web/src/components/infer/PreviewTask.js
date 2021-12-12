import _ from 'lodash';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

const PreviewTask = () => {
  const classList = [
    'birdhouse',
    'hourglass',
    'lemon',
    'pizza',
    'seashore',
    'stopwatch',
  ];

  return (
    <>
      <Row className="mt-5 mb-4">
        <Col>
          <h4 className="text-center">Preview Model</h4>
        </Col>
      </Row>
      <Row>
        <Col xs={11} className="mx-auto">
          Want to test out the platform without training a model? No worries. We
          have prepared a <b>preview</b>{' '}
          <mark>
            <b>image classification model</b>
          </mark>{' '}
          just for these cases. Please use the token given to below to test it
          out.
        </Col>
      </Row>
      <Row className="my-4">
        <Col xs={11} className="mx-auto">
          <h5>
            <b>Token:</b>&nbsp;&nbsp;&nbsp;
            imageClassification-tinyimgnet-demo-dbasb
          </h5>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col xs={11} className="mx-auto mb-2">
          <h5>About the Model</h5>
        </Col>
        <Col xs={11} className="mx-auto">
          <p>
            The model can classify images belonging to the following{' '}
            <mark>
              <b>six classes</b>
            </mark>
            :
          </p>
          {_.map(classList, item => {
            return (
              <Button
                variant="success"
                size="sm"
                className="mr-2 my-1"
                key={item}
              >
                {item}
              </Button>
            );
          })}
        </Col>
        <Col xs={11} className="mx-auto mt-3">
          The model was trained by fine-tuning a{' '}
          <mark>
            <b>ResNet34</b>
          </mark>{' '}
          model pre-trained on the ImageNet dataset.
        </Col>
      </Row>
    </>
  );
};

export default PreviewTask;

// imageClassification-tinyimgnet-demo-dbasb
