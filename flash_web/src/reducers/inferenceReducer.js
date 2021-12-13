import _ from 'lodash';

import {
  INFERENCE_CONFIG_SET,
  INFERENCE_CONFIG_CLEAR,
  INFERENCE_SUBMIT,
  INFERENCE_PREDICTION_CLEAR,
  INFERENCE_CLEAR,
  INFERENCE_DOWNLOAD_SET_PYTORCH,
  INFERENCE_DOWNLOAD_CLEAR_PYTORCH,
  INFERENCE_DOWNLOAD_SET_ONNX,
  INFERENCE_DOWNLOAD_CLEAR_ONNX,
} from '../actions/types';

const inferenceReducer = (state = {}, action) => {
  switch (action.type) {
    case INFERENCE_CONFIG_SET:
      return { ...state, ...action.payload };
    case INFERENCE_CONFIG_CLEAR:
      return _.omit(state, 'token', 'prediction', 'accuracy', 'accuracyPlot');
    case INFERENCE_SUBMIT:
      return { ...state, prediction: action.payload };
    case INFERENCE_PREDICTION_CLEAR:
      return _.omit(state, 'prediction');
    case INFERENCE_DOWNLOAD_SET_PYTORCH:
      return { ...state, downloadUrlPytorch: action.payload.downloadUrl };
    case INFERENCE_DOWNLOAD_CLEAR_PYTORCH:
      return _.omit(state, 'downloadUrlPytorch');
    case INFERENCE_DOWNLOAD_SET_ONNX:
      return { ...state, downloadUrlOnnx: action.payload.downloadUrl };
    case INFERENCE_DOWNLOAD_CLEAR_ONNX:
      return _.omit(state, 'downloadUrlOnnx');
    case INFERENCE_CLEAR:
      return {};
    default:
      return state;
  }
};

export default inferenceReducer;
