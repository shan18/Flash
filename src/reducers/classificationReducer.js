import _ from 'lodash';
import { CLASSIFY_ADD_CLASS, CLASSIFY_DELETE_CLASS } from '../actions/types';

const classificationReducer = (state = {}, action) => {
  switch (action.type) {
    case CLASSIFY_ADD_CLASS:
      return { ...state, [action.payload]: [] };
    case CLASSIFY_DELETE_CLASS:
      return _.omit(state, action.payload);
    default:
      return state;
  }
};

export default classificationReducer;
