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
  currentClass: '',
  currentConfig: { modelType: '', dataSplit: '' },
  dataset: {},
  datasetSize: {},
  datasetPreview: {},
};

const classificationReducer = (state = INITIAL_STATE, action) => {
  let dataset, datasetSize, datasetPreview, currentConfig, currentClass;
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
      datasetSize = { ...state.datasetSize, [action.payload]: 0 };
      datasetPreview = { ...state.datasetPreview, [action.payload]: [] };
      return { ...state, dataset, datasetSize, datasetPreview };
    case CLASSIFY_DELETE_CLASS:
      dataset = _.omit(state.dataset, action.payload);
      datasetSize = _.omit(state.datasetSize, action.payload);
      datasetPreview = _.omit(state.datasetPreview, action.payload);
      currentClass =
        state.currentClass === action.payload
          ? INITIAL_STATE.currentClass
          : state.currentClass;
      return { ...state, dataset, datasetSize, datasetPreview, currentClass };
    case CLASSIFY_CURRENT_CLASS:
      return { ...state, currentClass: action.payload };
    case CLASSIFY_ADD_IMAGES:
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
