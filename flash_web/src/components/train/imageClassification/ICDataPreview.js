import _ from 'lodash';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { connect } from 'react-redux';

class ICDataPreview extends React.Component {
  renderCard(imgUrl, imgId) {
    return (
      <Col className="mb-3" key={imgId}>
        <Card
          className="card-hover shadow bg-white rounded"
          style={{ width: '5rem' }}
        >
          <Card.Img variant="top" src={imgUrl} alt={`data-${imgId}`} />
        </Card>
      </Col>
    );
  }

  render() {
    return (
      <>
        {this.props.imgList ? (
          <Row xs={3} lg={4} xl={6} className="mt-5 mx-auto">
            {_.map(this.props.imgList, (image, imgId) =>
              this.renderCard(image, imgId)
            )}
          </Row>
        ) : (
          ''
        )}
      </>
    );
  }
}

const mapStateToProps = ({
  imageClassification: { currentClass, datasetPreview },
}) => {
  return { imgList: datasetPreview[currentClass] };
};

export default connect(mapStateToProps)(ICDataPreview);
