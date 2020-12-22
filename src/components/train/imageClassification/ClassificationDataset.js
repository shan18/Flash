import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import ClassificationClassChoiceForm from './ClassificationClassChoiceForm';
import { classifyCurrentClass } from '../../../actions';

class ClassificationDataset extends React.Component {
  onClassChoiceSubmit = values => {
    this.props.classifyCurrentClass(_.values(values)[0]);
  };

  render() {
    return (
      <ClassificationClassChoiceForm onSubmit={this.onClassChoiceSubmit} />
    );
  }
}

export default connect(null, { classifyCurrentClass })(ClassificationDataset);
