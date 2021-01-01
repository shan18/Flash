import _ from 'lodash';

import {
  INFERENCE_CONFIG_SET,
  INFERENCE_CONFIG_CLEAR,
  INFERENCE_SUBMIT,
} from '../actions/types';

const inferenceReducer = (state = {}, action) => {
  switch (action.type) {
    case INFERENCE_CONFIG_SET:
      return { ...state, ...action.payload };
    case INFERENCE_CONFIG_CLEAR:
      return _.omit(state, 'token');
    case INFERENCE_SUBMIT:
      return { ...state, prediction: action.payload };
    default:
      return state;
  }
};

export default inferenceReducer;
