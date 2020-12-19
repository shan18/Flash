import _ from 'lodash';
import { IMAGE_ADD_CLASS, IMAGE_DELETE_CLASS } from '../actions/types';

const imageClassificationReducer = (state = {}, action) => {
  switch (action.type) {
    case IMAGE_ADD_CLASS:
      return { ...state, [action.payload]: [] };
    case IMAGE_DELETE_CLASS:
      return _.omit(state, action.payload);
    default:
      return state;
  }
};

export default imageClassificationReducer;
