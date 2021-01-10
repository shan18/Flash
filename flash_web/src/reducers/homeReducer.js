import { SET_HOME, CLEAR_HOME } from '../actions/types';

const homeReducer = (state = null, action) => {
  switch (action.type) {
    case SET_HOME:
      return true;
    case CLEAR_HOME:
      return false;
    default:
      return state;
  }
};

export default homeReducer;
