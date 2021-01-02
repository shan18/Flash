import React from 'react';
import { connect } from 'react-redux';

import { clearInference } from '../../actions';
import TokenForm from './TokenForm';
import TaskDisplay from './TaskDisplay';

class Inference extends React.Component {
  componentWillUnmount() {
    this.props.clearInference();
  }

  render() {
    return (
      <div className="row">
        <div className="col">
          <h1 className="heading">Test Your Model</h1>
          <TokenForm />
          {this.props.token ? <TaskDisplay /> : ''}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ inference: { token } }) => {
  return { token };
};

export default connect(mapStateToProps, { clearInference })(Inference);
