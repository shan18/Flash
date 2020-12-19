import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import loadingFormReducer from './loadingFormReducer';

export default combineReducers({
  form: formReducer,
  loadingForm: loadingFormReducer,
});
