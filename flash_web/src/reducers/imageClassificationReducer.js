import _ from 'lodash';
import {
  IC_CONFIG,
  IC_MODEL_TYPE,
  IC_DATA_SPLIT,
  IC_ADD_CLASS,
  IC_DELETE_CLASS,
  IC_CURRENT_CLASS,
  IC_ADD_IMAGES,
  IC_DATA_CLEAR,
  IC_CLEAR,
} from '../actions/types';

const INITIAL_STATE = {
  configOptions: {},
  currentClass: '',
  currentConfig: { modelType: '', dataSplit: '' },
  dataset: {},
  datasetSize: {},
  datasetPreview: {},
};

const imageClassificationReducer = (state = INITIAL_STATE, action) => {
  let dataset, datasetSize, datasetPreview, currentConfig, currentClass;
  switch (action.type) {
    case IC_CONFIG:
      return {
        ...state,
        configOptions: _.omit(action.payload, 'currentConfig'),
        currentConfig: action.payload.currentConfig,
      };
    case IC_MODEL_TYPE:
      currentConfig = { ...state.currentConfig, modelType: action.payload };
      return { ...state, currentConfig };
    case IC_DATA_SPLIT:
      currentConfig = { ...state.currentConfig, dataSplit: action.payload };
      return { ...state, currentConfig };
    case IC_ADD_CLASS:
      dataset = { ...state.dataset, [action.payload]: [] };
      datasetSize = { ...state.datasetSize, [action.payload]: 0 };
      datasetPreview = { ...state.datasetPreview, [action.payload]: [] };
      return { ...state, dataset, datasetSize, datasetPreview };
    case IC_DELETE_CLASS:
      dataset = _.omit(state.dataset, action.payload);
      datasetSize = _.omit(state.datasetSize, action.payload);
      datasetPreview = _.omit(state.datasetPreview, action.payload);
      currentClass =
        state.currentClass === action.payload
          ? INITIAL_STATE.currentClass
          : state.currentClass;
      return { ...state, dataset, datasetSize, datasetPreview, currentClass };
    case IC_CURRENT_CLASS:
      return { ...state, currentClass: action.payload };
    case IC_ADD_IMAGES:
      dataset = {
        ...state.dataset,
        [state.currentClass]: [
          ...state.dataset[state.currentClass],
          ...action.payload.imagesList,
        ],
      };
      datasetSize = {
        ...state.datasetSize,
        [state.currentClass]:
          state.datasetSize[state.currentClass] + action.payload.imagesListSize,
      };
      datasetPreview = {
        ...state.datasetPreview,
        [state.currentClass]: [
          ...state.datasetPreview[state.currentClass],
          ...action.payload.imagesListPreview,
        ],
      };
      return { ...state, dataset, datasetSize, datasetPreview };
    case IC_DATA_CLEAR:
      return {
        ...state,
        ..._.omit(INITIAL_STATE, 'configOptions', 'currentConfig'),
      };
    case IC_CLEAR:
      return {
        ...state,
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};

export default imageClassificationReducer;
