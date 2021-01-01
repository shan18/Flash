import React from 'react';
import { connect } from 'react-redux';

import TokenForm from './TokenForm';
import TaskDisplay from './TaskDisplay';

class Inference extends React.Component {
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

export default connect(mapStateToProps)(Inference);
