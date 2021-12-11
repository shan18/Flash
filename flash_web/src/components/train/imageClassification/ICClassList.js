import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import ICClassListForm from './ICClassListForm';

class ICClassList extends React.Component {
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
        <ICClassListForm
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
          Number of classes must be within the{' '}
          <mark>
            <b>
              range {this.props.numClassesLimit.min} -{' '}
              {this.props.numClassesLimit.max}
            </b>
          </mark>
        </small>
        {this.renderClassList()}
      </>
    );
  }
}

const mapStateToProps = ({
  imageclassification: {
    dataset,
    configOptions: { numClassesLimit },
  },
}) => {
  return { classList: _.keys(dataset), numClassesLimit };
};

export default connect(mapStateToProps)(ICClassList);
