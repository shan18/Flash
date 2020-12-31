import React from 'react';

import TokenForm from './TokenForm';
import InferenceForm from './InferenceForm';

class Inference extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col">
          <h1 className="heading">Test Your Model</h1>
          <TokenForm />
          <InferenceForm />
        </div>
      </div>
    );
  }
}

export default Inference;
