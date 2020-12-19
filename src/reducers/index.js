import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import loadingFormReducer from './loadingFormReducer';
import imageClassificationReducer from './imageClassificationReducer';

export default combineReducers({
  form: formReducer,
  loadingForm: loadingFormReducer,
  imageClassification: imageClassificationReducer,
});
