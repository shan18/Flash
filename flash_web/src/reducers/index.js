import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import navigationReducer from './navigationReducer';
import mobileViewReducer from './mobileViewReducer';
import homeReducer from './homeReducer';
import loadingFormReducer from './loadingFormReducer';
import formFileFieldReducer from './formFileFieldReducer';
import imageClassificationReducer from './imageClassificationReducer';
import textClassificationReducer from './textClassificationReducer';
import serverConfigReducer from './serverConfigReducer';
import inferenceReducer from './inferenceReducer';

export default combineReducers({
  form: formReducer,
  navigationLinks: navigationReducer,
  isMobile: mobileViewReducer,
  isHome: homeReducer,
  loadingForm: loadingFormReducer,
  formFileField: formFileFieldReducer,
  imageClassification: imageClassificationReducer,
  textClassification: textClassificationReducer,
  serverConfig: serverConfigReducer,
  inference: inferenceReducer,
});
