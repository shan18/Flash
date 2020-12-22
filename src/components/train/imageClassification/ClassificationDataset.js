import React from 'react';
import { connect } from 'react-redux';

import ClassificationClassChoiceForm from './ClassificationClassChoiceForm';

class ClassificationDataset extends React.Component {
  render() {
    return <ClassificationClassChoiceForm />;
  }
}

const mapStateToProps = ({ classification }) => {
  return { classification };
};

export default connect(mapStateToProps)(ClassificationDataset);
