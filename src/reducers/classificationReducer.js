import _ from 'lodash';
import {
  CLASSIFY_CONFIG,
  CLASSIFY_MODEL_TYPE,
  CLASSIFY_DATA_SPLIT,
  CLASSIFY_ADD_CLASS,
  CLASSIFY_DELETE_CLASS,
  CLASSIFY_CURRENT_CLASS,
  CLASSIFY_ADD_IMAGES,
  CLASSIFY_CLEAR,
} from '../actions/types';

const INITIAL_STATE = {
  configOptions: {},
  currentClass: null,
  currentConfig: { modelType: '', dataSplit: '' },
  dataset: {},
  size: 0,
};

const classificationReducer = (state = INITIAL_STATE, action) => {
  let dataset;
  let currentConfig;
  switch (action.type) {
    case CLASSIFY_CONFIG:
      return {
        ...state,
        configOptions: _.omit(action.payload, 'currentConfig'),
        currentConfig: action.payload.currentConfig,
      };
    case CLASSIFY_MODEL_TYPE:
      currentConfig = { ...state.currentConfig, modelType: action.payload };
      return { ...state, currentConfig };
    case CLASSIFY_DATA_SPLIT:
      currentConfig = { ...state.currentConfig, dataSplit: action.payload };
      return { ...state, currentConfig };
    case CLASSIFY_ADD_CLASS:
      dataset = { ...state.dataset, [action.payload]: [] };
      return { ...state, dataset };
    case CLASSIFY_DELETE_CLASS:
      dataset = _.omit(state.dataset, action.payload);
      return { ...state, dataset };
    case CLASSIFY_CURRENT_CLASS:
      return { ...state, currentClass: action.payload };
    case CLASSIFY_ADD_IMAGES:
      dataset = {
        ...state.dataset,
        [state.currentClass]: [
          ...state.dataset[state.currentClass],
          ...action.payload,
        ],
      };
      return { ...state, dataset };
    case CLASSIFY_CLEAR:
      return {
        ...state,
        ..._.omit(INITIAL_STATE, 'configOptions', 'currentConfig'),
      };
    default:
      return state;
  }
};

export default classificationReducer;
