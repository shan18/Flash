import {
  PLAYGROUND_SUBMIT,
  PLAYGROUND_PREDICTION_CLEAR,
} from '../actions/types';

const INITIAL_STATE = {
  name: '',
  data: null,
};

const playgroundReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PLAYGROUND_SUBMIT:
      return { ...state, ...action.payload };
    case PLAYGROUND_PREDICTION_CLEAR:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};

export default playgroundReducer;
