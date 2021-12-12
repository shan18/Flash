import _ from 'lodash';
import {
  TC_CONFIG,
  TC_RNN_TYPE,
  TC_DATA_SPLIT,
  TC_DATA_ADD,
  TC_DATA_CLEAR,
  TC_CLEAR,
} from '../actions/types';

const INITIAL_STATE = {
  configOptions: {},
  currentConfig: { modelType: '', dataSplit: '' },
  dataset: null,
};

const textClassificationReducer = (state = INITIAL_STATE, action) => {
  let currentConfig;
  switch (action.type) {
    case TC_CONFIG:
      return {
        ...state,
        configOptions: _.omit(action.payload, 'currentConfig'),
        currentConfig: action.payload.currentConfig,
      };
    case TC_RNN_TYPE:
      currentConfig = { ...state.currentConfig, modelType: action.payload };
      return { ...state, currentConfig };
    case TC_DATA_SPLIT:
      currentConfig = { ...state.currentConfig, dataSplit: action.payload };
      return { ...state, currentConfig };
    case TC_DATA_ADD:
      return {
        ...state,
        dataset: action.payload,
      };
    case TC_DATA_CLEAR:
      return {
        ...state,
        ..._.omit(INITIAL_STATE, 'configOptions', 'currentConfig'),
      };
    case TC_CLEAR:
      return {
        ...state,
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};

export default textClassificationReducer;
