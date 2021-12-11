import _ from 'lodash';
import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { FaCheck } from 'react-icons/fa';
import { MdDelete, MdError } from 'react-icons/md';

import { icAddClass, icDeleteClass } from '../../../actions';

class ICClassListForm extends React.Component {
  state = {
    classValue: '',
    isSaved: false,
  };

  toggleSaveMode = () => {
    this.setState({ isSaved: !this.state.isSaved });
  };

  onSubmit() {
    const { isSaved } = this.state;
    if (!isSaved && this.props.classList.includes(this.state.classValue)) {
      toast.error(
        <div>
          <MdError size={25} />
          &nbsp; A class with name "{this.state.classValue}" already exists!
        </div>
      );
    } else {
      const { classValue } = this.state;
      if (!isSaved) {
        this.props.icAddClass(classValue);
      } else {
        this.props.icDeleteClass(classValue);
        this.setState({ classValue: '' });
      }
      this.toggleSaveMode();
    }
  }

  componentDidMount() {
    if (this.props.initialData) {
      this.setState({ ...this.props.initialData });
    }
  }

  render() {
    return (
      <Form
        onSubmit={event => {
          event.preventDefault();
          this.onSubmit();
        }}
        className="my-2"
      >
        <InputGroup>
          <Form.Control
            type="text"
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
              <Button type="submit" variant="danger">
                <MdDelete />
              </Button>
            ) : (
              <Button type="submit" variant="outline-success">
                <FaCheck />
              </Button>
            )}
          </div>
        </InputGroup>
      </Form>
    );
  }
}

const mapStateToProps = ({ imageclassification: { dataset } }) => {
  return { classList: _.keys(dataset) };
};

export default connect(mapStateToProps, {
  icAddClass,
  icDeleteClass,
})(ICClassListForm);
