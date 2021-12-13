import { PLAYGROUND_SUBMIT } from '../actions/types';

const INITIAL_STATE = {
  name: '',
  data: null,
};

const playgroundReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PLAYGROUND_SUBMIT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default playgroundReducer;
