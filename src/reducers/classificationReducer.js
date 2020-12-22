import _ from 'lodash';
import {
  CLASSIFY_ADD_CLASS,
  CLASSIFY_DELETE_CLASS,
  CLASSIFY_CURRENT_CLASS,
} from '../actions/types';

const INITIAL_STATE = {
  currentClass: null,
  dataset: {},
};

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
    default:
      return state;
  }
};

export default classificationReducer;
