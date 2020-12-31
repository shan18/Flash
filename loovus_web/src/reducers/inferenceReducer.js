import _ from 'lodash';

import { INFERENCE_CONFIG_SET, INFERENCE_CONFIG_CLEAR } from '../actions/types';

const inferenceReducer = (state = {}, action) => {
  switch (action.type) {
    case INFERENCE_CONFIG_SET:
      return { ...state, ...action.payload };
    case INFERENCE_CONFIG_CLEAR:
      return _.omit(state, 'token');
    default:
      return state;
  }
};

export default inferenceReducer;
