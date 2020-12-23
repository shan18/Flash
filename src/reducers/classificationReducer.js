import _ from 'lodash';
import {
  CLASSIFY_ADD_CLASS,
  CLASSIFY_DELETE_CLASS,
  CLASSIFY_CURRENT_CLASS,
  CLASSIFY_ADD_IMAGES,
  CLASSIFY_CLEAR,
} from '../actions/types';

const INITIAL_STATE = {
  currentClass: null,
  dataset: {},
  size: 0,
};

const getSize = list => {};

const classificationReducer = (state = INITIAL_STATE, action) => {
  let dataset;
  switch (action.type) {
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
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};

export default classificationReducer;
