import _ from 'lodash';
import {
  SA_CONFIG,
  SA_RNN_TYPE,
  SA_DATA_SPLIT,
  SA_DATA_ADD,
  SA_DATA_CLEAR,
  SA_CLEAR,
} from '../actions/types';

const INITIAL_STATE = {
  configOptions: {},
  currentConfig: { modelType: '', dataSplit: '' },
  dataset: null,
};

const sentimentAnalysisReducer = (state = INITIAL_STATE, action) => {
  let currentConfig;
  switch (action.type) {
    case SA_CONFIG:
      return {
        ...state,
        configOptions: _.omit(action.payload, 'currentConfig'),
        currentConfig: action.payload.currentConfig,
      };
    case SA_RNN_TYPE:
      currentConfig = { ...state.currentConfig, modelType: action.payload };
      return { ...state, currentConfig };
    case SA_DATA_SPLIT:
      currentConfig = { ...state.currentConfig, dataSplit: action.payload };
      return { ...state, currentConfig };
    case SA_DATA_ADD:
      return {
        ...state,
        dataset: action.payload,
      };
    case SA_DATA_CLEAR:
      return {
        ...state,
        ..._.omit(INITIAL_STATE, 'configOptions', 'currentConfig'),
      };
    case SA_CLEAR:
      return {
        ...state,
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};

export default sentimentAnalysisReducer;
