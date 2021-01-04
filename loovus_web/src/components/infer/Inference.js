import React from 'react';
import { connect } from 'react-redux';

import { clearInference } from '../../actions';
import TokenForm from './TokenForm';
import TaskDisplay from './TaskDisplay';

class Inference extends React.Component {
  constructor(props) {
    super(props);

    this.taskName = 'inference';
  }

  componentWillUnmount() {
    this.props.clearInference(this.taskName);
  }

  render() {
    return (
      <div className="row">
        <div className="col">
          <h1 className="heading">Test Your Model</h1>
          <TokenForm />
          {this.props.token ? <TaskDisplay taskName={this.taskName} /> : ''}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ inference: { token } }) => {
  return { token };
};

export default connect(mapStateToProps, { clearInference })(Inference);
