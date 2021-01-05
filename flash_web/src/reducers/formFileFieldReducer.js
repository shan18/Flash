import _ from 'lodash';
import {
  SET_FORM_FILE_FIELD_LABEL,
  CLEAR_FORM_FILE_FIELD_LABEL,
} from '../actions/types';

const INITIAL_STATE = {};

const formFileFieldReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_FORM_FILE_FIELD_LABEL:
      return { ...state, [action.payload.taskName]: action.payload.label };
    case CLEAR_FORM_FILE_FIELD_LABEL:
      return _.omit(state, action.payload);
    default:
      return state;
  }
};

export default formFileFieldReducer;
