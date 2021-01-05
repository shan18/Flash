import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import ClassificationClassListForm from './ClassificationClassListForm';

class ClassificationClassList extends React.Component {
  renderClassList() {
    return _.map(_.range(0, this.props.numClassesLimit.max), number => {
      let isOptionalField =
        number >= this.props.numClassesLimit.min ? true : false;
      let initialData = null;
      if (number < this.props.classList.length) {
        initialData = {
          classValue: this.props.classList[number],
          isSaved: true,
        };
      }
      return (
        <ClassificationClassListForm
          form="classForm"
          isOptionalField={isOptionalField}
          key={number}
          initialData={initialData}
        />
      );
    });
  }

  render() {
    return (
      <>
        <h4>Classes</h4>
        <small>
          Number of classes must be within the range{' '}
          {this.props.numClassesLimit.min} - {this.props.numClassesLimit.max}
        </small>
        {this.renderClassList()}
      </>
    );
  }
}

const mapStateToProps = ({
  classification: {
    dataset,
    configOptions: { numClassesLimit },
  },
}) => {
  return { classList: _.keys(dataset), numClassesLimit };
};

export default connect(mapStateToProps)(ClassificationClassList);
