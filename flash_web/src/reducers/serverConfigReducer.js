import { TRAIN_TOKEN_SET, TRAIN_TOKEN_CLEAR } from '../actions/types';

const serverConfigReducer = (state = {}, action) => {
  switch (action.type) {
    case TRAIN_TOKEN_SET:
      return { ...state, token: action.payload };
    case TRAIN_TOKEN_CLEAR:
      return { ...state, token: '' };
    default:
      return state;
  }
};

export default serverConfigReducer;
