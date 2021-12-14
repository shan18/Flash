import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiInstagram } from 'react-icons/si';

class About extends React.Component {
  constructor(props) {
    super(props);

    this.trainingSectionRef = React.createRef();
    this.inferenceSectionRef = React.createRef();
    this.playgroundSectionRef = React.createRef();

    this.trainingSnapshots = [
      {
        image: `${process.env.PUBLIC_URL}/assets/media/training_page.png`,
        text: 'Training page',
      },
      {
        image: `${process.env.PUBLIC_URL}/assets/media/img_classification_data_upload.png`,
        text: 'Image classification data upload',
      },
      {
        image: `${process.env.PUBLIC_URL}/assets/media/tc_data_upload.png`,
        text: 'Text classification data upload',
      },
    ];

    this.inferenceSnapshots = [
      {
        image: `${process.env.PUBLIC_URL}/assets/media/tc_inference_form.png`,
        text: 'Inference results',
      },
      {
        image: `${process.env.PUBLIC_URL}/assets/media/img_classification_prediction.png`,
        text: 'Image classification prediction',
      },
      {
        image: `${process.env.PUBLIC_URL}/assets/media/inference_page.png`,
        text: 'Inference page',
      },
    ];

    this.playgroundSnapshots = [
      {
        image: `${process.env.PUBLIC_URL}/assets/media/playground_page.png`,
        text: 'Playground page',
      },
      {
        image: `${process.env.PUBLIC_URL}/assets/media/neural_style_transfer_page.png`,
        text: 'Neural style transfer results',
      },
      {
        image: `${process.env.PUBLIC_URL}/assets/media/human_pose_estimation_page.png`,
        text: 'Human pose estimation results',
      },
    ];
  }

  componentDidMount() {
    const { state: locationState } = this.props.location;
    if (locationState) {
      if (locationState.targetSection === 'training') {
        this.trainingSectionRef.current.scrollIntoView({
          behaviour: 'smooth',
        });
      } else if (locationState.targetSection === 'inference') {
        this.inferenceSectionRef.current.scrollIntoView({
          behaviour: 'smooth',
        });
      }
    }
  }

  renderFlash() {
    return (
      <mark>
        <b>
          <Image
            src={`${process.env.PUBLIC_URL}/flash.svg`}
            style={{ height: '1.8vh' }}
            alt="flash logo"
          />{' '}
          F L A S H
        </b>
      </mark>
    );
  }

  renderImageClassificationInfo() {
    return (
      <Row>
        <Col xs={12} md={7} className="my-auto">
          <h3 className="mb-3">Image Classification</h3>
          <p>
            Classify images from your own dataset by using them to train a{' '}
            <mark>
              <b>ResNet-34</b>
            </mark>{' '}
            or{' '}
            <mark>
              <b>MobileNet v2</b>
            </mark>{' '}
            model.
          </p>
          <p>
            Training happens via transfer learning where models available will
            be pre-trained on the ImageNet dataset.
          </p>
        </Col>
        <Col xs={12} md={5} className="my-auto">
          <Card className="mx-auto mt-4">
            <Card.Img
              variant="top"
              as="video"
              playsInline="playsinline"
              autoPlay="autoplay"
              muted="muted"
            >
              <source
                src={`${process.env.PUBLIC_URL}/assets/media/imageClassification.mp4`}
                type="video/mp4"
              />
            </Card.Img>
          </Card>
        </Col>
      </Row>
    );
  }

  renderTextClassificationInfo() {
    return (
      <Row className="my-5">
        <Col xs={12} md={7} className="my-auto">
          <h3 className="mb-3">Text Classification</h3>
          <p>
            Classify sentences by training a{' '}
            <mark>
              <b>LSTM</b>
            </mark>{' '}
            or{' '}
            <mark>
              <b>GRU</b>
            </mark>{' '}
            based sequential model on your own dataset.
          </p>
          <p>The models will be trained from scratch.</p>
        </Col>
        <Col xs={12} md={5} className="my-auto">
          <Card className="mx-auto mt-4">
            <Card.Img
              variant="top"
              as="video"
              playsInline="playsinline"
              autoPlay="autoplay"
              muted="muted"
            >
              <source
                src={`${process.env.PUBLIC_URL}/assets/media/textClassification.mp4`}
                type="video/mp4"
              />
            </Card.Img>
          </Card>
        </Col>
      </Row>
    );
  }

  renderSnapshots(snapshotData) {
    return (
      <Row xs={1} md={3} className="mx-auto mt-4">
        {snapshotData.map(snapshot => (
          <Col className="mb-3" key={snapshot.text}>
            <Card className="card-hover shadow bg-white rounded">
              <Card.Img
                variant="top"
                className="img-fluid"
                src={snapshot.image}
                alt={snapshot.text}
              />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  renderTrainingInfo() {
    return (
      <div ref={this.trainingSectionRef}>
        <h3 className="mb-3 mt-5">Training</h3>
        <p>
          For training a model, you'll have to <b>upload your own dataset</b>{' '}
          and <b>select the model parameters</b>. Depending on the size of the
          dataset, the model can take anywhere between{' '}
          <b>
            <mark>3 - 10 minutes</mark> to train and deploy your model
          </b>
          .
        </p>
        <p>
          After you upload your configuration, the platform will assign you a
          unique{' '}
          <mark>
            <b>token</b>
          </mark>
          . Please save the token as it will used to test the model on the{' '}
          <Link to="/inference">inference page</Link>.
        </p>
        <p>
          To train a model, <Link to="/training">go here</Link>.
        </p>
        {this.renderSnapshots(this.trainingSnapshots)}
      </div>
    );
  }

  renderInferenceInfo() {
    return (
      <div ref={this.inferenceSectionRef}>
        <h3 className="mb-3 mt-5">Inference</h3>
        <p>
          You can perform inference on a trained model by using the{' '}
          <b>
            <mark>token</mark>
          </b>{' '}
          provided to you after submitting the training configuration on the{' '}
          <Link to="/training">training page</Link>.
        </p>
        <p>
          After submitting the token, you'll get a form where you can upload
          inputs to check the performance of your trained model. The inference
          page also provides you with the <b>results of the training process</b>{' '}
          by showing you the{' '}
          <b>
            <mark>accuracy</mark>
          </b>{' '}
          of the model <b>on validation set</b> as well as the{' '}
          <b>
            <mark>change in accuracy</mark>
          </b>{' '}
          during training.
        </p>
        <p>
          To test your model, <Link to="/inference">go here</Link>.
        </p>
        {this.renderSnapshots(this.inferenceSnapshots)}
      </div>
    );
  }

  renderPlaygroundInfo() {
    return (
      <div ref={this.playgroundSectionRef}>
        <h3 className="mb-3 mt-5">Playground</h3>
        <p>
          Don't have any models to train yet? Don't worry, we have trained some
          fun models such as{' '}
          <b>
            <mark>Human Pose Estimation</mark>
          </b>{' '}
          and{' '}
          <b>
            <mark>Neural Style Transfer</mark>
          </b>{' '}
          for you to try out in the{' '}
          <Link to="/playground">playground page</Link>. The models are already
          trained and deployed so that you can directly perform inference on
          them.
        </p>
        {this.renderSnapshots(this.playgroundSnapshots)}
      </div>
    );
  }

  render() {
    return (
      <Container style={{ fontSize: '1.6vh' }}>
        <h1 className="heading">
          About{' '}
          <Image
            src={`${process.env.PUBLIC_URL}/flash.svg`}
            style={{ height: '8vh' }}
            alt="flash logo"
          />{' '}
          Flash
        </h1>
        <Row>
          <Col xs={12} className="mx-auto">
            <p className="text-center mb-5">
              {this.renderFlash()}
              &nbsp;&nbsp;&nbsp; is an <b>end-to-end Deep Learning</b> platform
              which allows users to create, train and deploy their own neural
              network models in a matter of minutes without writing a single
              line of code.
            </p>
            <p>The platform currently supports two types of tasks:</p>
            {this.renderImageClassificationInfo()}
            {this.renderTextClassificationInfo()}
            <hr className="my-5" />
            <h2>How It Works</h2>
            <p className="my-4">
              Using {this.renderFlash()} is easy. With just a few clicks you can
              train and deploy your models automatically. You just have to
              select your model and upload the dataset, and you're good to go.{' '}
              <b>No code or experience required.</b>
            </p>
            {this.renderTrainingInfo()}
            {this.renderInferenceInfo()}
            {this.renderPlaygroundInfo()}
            <hr className="my-5" />
            <p>
              The source code of the project is hosted on GitHub. Please{' '}
              <a
                href="https://github.com/shan18/Flash"
                target="_blank"
                rel="noreferrer"
              >
                click here
              </a>{' '}
              to visit.
            </p>
            <p className="mt-4">
              To know about the author, check the links below
            </p>
            <p>
              <a
                className="anchor-black"
                href="https://github.com/shan18"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub size={25} title="GitHub: shan18" />
              </a>
              <a
                className="anchor-black"
                href="https://www.linkedin.com/in/shanacharya/"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin
                  size={25}
                  title="LinkedIn: shanacharya"
                  className="mx-3"
                />
              </a>
              <a
                className="anchor-black"
                href="https://www.instagram.com/shan_1.0/"
                target="_blank"
                rel="noreferrer"
              >
                <SiInstagram size={25} title="Instagram: shan_1.0" />
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default About;
