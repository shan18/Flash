import { LOADING_FORM, CLEAR_LOADING_FORM } from '../actions/types';

const loadingFormReducer = (state = [], action) => {
  switch (action.type) {
    case LOADING_FORM:
      return [...state, action.payload];
    case CLEAR_LOADING_FORM:
      return state.filter(element => element !== action.payload);
    default:
      return state;
  }
};

export default loadingFormReducer;
