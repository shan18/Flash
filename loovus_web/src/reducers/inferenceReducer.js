import _ from 'lodash';

import {
  INFERENCE_CONFIG_SET,
  INFERENCE_CONFIG_CLEAR,
  INFERENCE_SUBMIT,
  INFERENCE_PREDICTION_CLEAR,
} from '../actions/types';

const inferenceReducer = (state = {}, action) => {
  switch (action.type) {
    case INFERENCE_CONFIG_SET:
      return { ...state, ...action.payload };
    case INFERENCE_CONFIG_CLEAR:
      return _.omit(state, 'token', 'prediction');
    case INFERENCE_SUBMIT:
      return { ...state, prediction: action.payload };
    case INFERENCE_PREDICTION_CLEAR:
      return _.omit(state, 'prediction');
    default:
      return state;
  }
};

export default inferenceReducer;
