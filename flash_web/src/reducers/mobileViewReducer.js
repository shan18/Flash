import { SET_MOBILE } from '../actions/types';

const homeReducer = (state = null, action) => {
  switch (action.type) {
    case SET_MOBILE:
      return action.payload;
    default:
      return state;
  }
};

export default homeReducer;
