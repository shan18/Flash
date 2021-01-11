import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiInstagram } from 'react-icons/si';

class About extends React.Component {
  constructor(props) {
    super(props);

    this.trainingSectionRef = React.createRef();
    this.inferenceSectionRef = React.createRef();
  }

  componentDidMount() {
    const { state: locationState } = this.props.location;
    console.log(locationState);
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
          <img
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
      <div className="row">
        <div className="col my-auto">
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
        </div>
        <div className="col my-auto">
          <div className="card mx-auto mt-4" style={{ width: '20rem' }}>
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/imageClassification.gif`}
              className="card-img-top"
              alt="img classification gif"
            />
          </div>
        </div>
      </div>
    );
  }

  renderSentimentAnalysisInfo() {
    return (
      <div className="row my-5">
        <div className="col my-auto">
          <h3 className="mb-3">Sentiment Analysis</h3>
          <p>
            Predict sentiment from sentences by training a{' '}
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
        </div>
        <div className="col my-auto">
          <div className="card mx-auto mt-4" style={{ width: '20rem' }}>
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/sentimentAnalysis.gif`}
              className="card-img-top"
              alt="sentiment analysis gif"
            />
          </div>
        </div>
      </div>
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
        <div className="row row-cols-1 row-cols-md-3 mx-auto mt-4">
          <div className="col mb-3">
            <div className="card card-hover shadow bg-white rounded">
              <img
                className="img-fluid card-img-top"
                src={`${process.env.PUBLIC_URL}/assets/images/training_page.png`}
                alt="training page"
              />
            </div>
          </div>
          <div className="col mb-3">
            <div className="card card-hover shadow bg-white rounded">
              <img
                className="img-fluid card-img-top"
                src={`${process.env.PUBLIC_URL}/assets/images/img_classification_data_upload.png`}
                alt="img classification data upload"
              />
            </div>
          </div>
          <div className="col mb-3">
            <div className="card card-hover shadow bg-white rounded">
              <img
                className="img-fluid card-img-top"
                src={`${process.env.PUBLIC_URL}/assets/images/sa_data_upload.png`}
                alt="sentiment analysis data upload"
              />
            </div>
          </div>
        </div>
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
        <div className="row row-cols-1 row-cols-md-3 mx-auto mt-4">
          <div className="col mb-3">
            <div className="card card-hover shadow bg-white rounded">
              <img
                className="img-fluid card-img-top"
                src={`${process.env.PUBLIC_URL}/assets/images/sa_inference_form.png`}
                alt="img classification data upload"
              />
            </div>
          </div>
          <div className="col mb-3">
            <div className="card card-hover shadow bg-white rounded">
              <img
                className="img-fluid card-img-top"
                src={`${process.env.PUBLIC_URL}/assets/images/img_classification_prediction.png`}
                alt="img classification prediction"
              />
            </div>
          </div>
          <div className="col mb-3">
            <div className="card card-hover shadow bg-white rounded">
              <img
                className="img-fluid card-img-top"
                src={`${process.env.PUBLIC_URL}/assets/images/inference_page.png`}
                alt="inference page"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="container" style={{ fontSize: '1.6vh' }}>
        <h1 className="heading">
          About{' '}
          <img
            src={`${process.env.PUBLIC_URL}/flash.svg`}
            style={{ height: '8vh' }}
            alt="flash logo"
          />{' '}
          Flash
        </h1>
        <div className="row">
          <div className="col-12 mx-auto">
            <p className="text-center mb-5">
              {this.renderFlash()}
              &nbsp;&nbsp;&nbsp; is an <b>end-to-end Deep Learning</b> platform
              which allows users to create, train and deploy their own neural
              network models in a matter of minutes without writing a single
              line of code.
            </p>
            <p>The platform currently supports two types of tasks:</p>
            {this.renderImageClassificationInfo()}
            {this.renderSentimentAnalysisInfo()}
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
          </div>
        </div>
      </div>
    );
  }
}

export default About;
