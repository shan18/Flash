import _ from 'lodash';

import { INFERENCE_TOKEN_SET, INFERENCE_TOKEN_CLEAR } from '../actions/types';

const inferenceReducer = (state = {}, action) => {
  switch (action.type) {
    case INFERENCE_TOKEN_SET:
      return { ...state, token: action.payload };
    case INFERENCE_TOKEN_CLEAR:
      return _.omit(state, 'token');
    default:
      return state;
  }
};

export default inferenceReducer;
