import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import loadingFormReducer from './loadingFormReducer';
import classificationReducer from './classificationReducer';
import serverConfigReducer from './serverConfigReducer';

export default combineReducers({
  form: formReducer,
  loadingForm: loadingFormReducer,
  classification: classificationReducer,
  serverConfig: serverConfigReducer,
});
