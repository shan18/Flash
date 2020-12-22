import React from 'react';
import { connect } from 'react-redux';
import { FaCheck } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

import { classifyAddClass, classifyDeleteClass } from '../../../actions';

class ClassificationClassListForm extends React.Component {
  state = {
    classValue: '',
    isSaved: false,
  };

  toggleSaveMode = () => {
    this.setState({ isSaved: !this.state.isSaved });
  };

  onSubmit() {
    const { isSaved, classValue } = this.state;
    if (!isSaved) {
      this.props.classifyAddClass(classValue);
    } else {
      this.props.classifyDeleteClass(classValue);
      this.setState({ classValue: '' });
    }
    this.toggleSaveMode();
  }

  componentDidMount() {
    if (this.props.initialData) {
      this.setState({ ...this.props.initialData });
    }
  }

  render() {
    return (
      <form
        onSubmit={event => {
          event.preventDefault();
          this.onSubmit();
        }}
        className="my-2"
      >
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder={`Enter class name${
              this.props.isOptionalField ? ' (optional)' : ''
            }`}
            autoComplete="off"
            onChange={event =>
              this.setState({ classValue: event.target.value })
            }
            value={this.state.classValue}
            readOnly={this.state.isSaved}
            pattern="[a-zA-Z0-9 ]+"
            title="Only alphabets, numbers and spaces are allowed"
            required
          />
          <div className="input-group-append">
            {this.state.isSaved ? (
              <button className="btn btn-danger">
                <MdDelete />
              </button>
            ) : (
              <button className="btn btn-outline-success">
                <FaCheck />
              </button>
            )}
          </div>
        </div>
      </form>
    );
  }
}

export default connect(null, { classifyAddClass, classifyDeleteClass })(
  ClassificationClassListForm
);
