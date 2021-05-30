import { SET_NAV_LINKS } from '../actions/types';

const navigationReducer = (state = [], action) => {
  switch (action.type) {
    case SET_NAV_LINKS:
      return action.payload;
    default:
      return state;
  }
};

export default navigationReducer;
