import React from 'react';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import { connect } from 'react-redux';

const ServiceAlert = ({ isHome }) => {
  return (
    <>
      {isHome ? (
        ''
      ) : (
        <Container>
          <Alert variant="danger mt-5">
            <Alert.Heading>No Backend Servers!</Alert.Heading>
            <p>
              In order to save server costs, all the backend services for this
              portal have been shutdown. This means that no training and
              inference service will be provided at this time.
            </p>
            <p>
              To see how this project works, you can check this{' '}
              <Alert.Link href="https://www.youtube.com/watch?v=nQYw2QX0Ywk">
                YouTube video
              </Alert.Link>{' '}
              .
            </p>
            <hr />
            <p class="mb-0">
              To get the backend functionality back, please refer to the{' '}
              <Alert.Link href="https://github.com/shan18/Flash">
                Flash
              </Alert.Link>{' '}
              GitHub repository for instructions to setup your own backend
              servers on AWS.
            </p>
          </Alert>
        </Container>
      )}
    </>
  );
};

const mapStateToProps = ({ isHome }) => {
  return { isHome };
};

export default connect(mapStateToProps)(ServiceAlert);
