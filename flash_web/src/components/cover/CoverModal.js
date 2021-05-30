import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

import '../../styles/Modal.css';

class CoverModal extends React.Component {
  constructor(props) {
    super(props);

    this.modalCardContent = [
      {
        title: 'Training',
        targetUrl: '/training',
        contentImage: `${process.env.PUBLIC_URL}/assets/media/training.gif`,
        contentText: (
          <>
            Train an{' '}
            <mark>
              <b>Image Classification</b>
            </mark>{' '}
            or{' '}
            <mark>
              <b>Sentiment Analysis</b>
            </mark>{' '}
            model on your custom dataset.
          </>
        ),
        buttonText: 'Choose Task',
      },
      {
        title: 'Inference',
        targetUrl: '/inference',
        contentImage: `${process.env.PUBLIC_URL}/assets/media/inference.gif`,
        contentText:
          'Already trained a model on Flash? Choose this to test your model.',
        buttonText: 'Test Model',
      },
    ];
  }

  renderCardContent({
    title,
    targetUrl,
    contentImage,
    contentText,
    buttonText,
  }) {
    return (
      <Card className="card-hover" key={targetUrl}>
        <Card.Img
          src={contentImage}
          variant="top"
          style={{ height: '24vh' }}
          alt={title}
        />
        <Card.Body>
          <Card.Title className="text-center" style={{ fontSize: '2.3vh' }}>
            {title}
          </Card.Title>
          <Card.Text className="my-4">{contentText}</Card.Text>
          <div className="text-center">
            <Button variant="info" as={Link} to={targetUrl}>
              {buttonText}
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  renderContent() {
    return (
      <CardDeck className="px-0 px-md-5">
        {_.map(this.modalCardContent, item => {
          return this.renderCardContent(item);
        })}
      </CardDeck>
    );
  }

  render() {
    return ReactDOM.createPortal(
      <div className="modal-container" onClick={this.props.onDismiss}>
        <div className="modal-body" onClick={e => e.stopPropagation()}>
          <h3 className="text-center">Get Started</h3>
          <hr className="w-100 mb-4" />
          {this.renderContent()}
          <hr className="w-100 mt-4" />
          <Row>
            <Col className="text-right">
              <Button
                variant="warning"
                className="mr-2"
                onClick={this.props.onDismiss}
              >
                Go Back
              </Button>
            </Col>
          </Row>
        </div>
      </div>,
      document.querySelector('#modal') // places the modal inside the container with id 'modal' in index.html
    );
  }
}

export default CoverModal;
