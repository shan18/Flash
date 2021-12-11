import { reset } from 'redux-form';

import {
  SET_NAV_LINKS,
  SET_MOBILE,
  SET_HOME,
  CLEAR_HOME,
  LOADING_FORM,
  CLEAR_LOADING_FORM,
  SET_FORM_FILE_FIELD_LABEL,
  CLEAR_FORM_FILE_FIELD_LABEL,
  TRAIN_TOKEN_SET,
  TRAIN_TOKEN_CLEAR,
  IC_CONFIG,
  IC_MODEL_TYPE,
  IC_DATA_SPLIT,
  IC_ADD_CLASS,
  IC_DELETE_CLASS,
  IC_CURRENT_CLASS,
  IC_ADD_IMAGES,
  IC_DATA_CLEAR,
  IC_CLEAR,
  SA_CONFIG,
  SA_RNN_TYPE,
  SA_DATA_SPLIT,
  SA_DATA_ADD,
  SA_DATA_CLEAR,
  SA_CLEAR,
  INFERENCE_CONFIG_SET,
  INFERENCE_CONFIG_CLEAR,
  INFERENCE_SUBMIT,
  INFERENCE_PREDICTION_CLEAR,
  INFERENCE_CLEAR,
} from './types';
import {
  networkTransaction,
  statusCheck,
  toastError,
  checkResponse,
} from './utils';

export const setNavLinks = navLinks => {
  return {
    type: SET_NAV_LINKS,
    payload: navLinks,
  };
};

export const setMobile = isMobile => {
  return {
    type: SET_MOBILE,
    payload: isMobile,
  };
};

export const setHome = () => {
  return {
    type: SET_HOME,
  };
};

export const clearHome = () => {
  return {
    type: CLEAR_HOME,
  };
};

export const loadingForm = formName => {
  return {
    type: LOADING_FORM,
    payload: formName,
  };
};

export const clearLoadingForm = formName => {
  return {
    type: CLEAR_LOADING_FORM,
    payload: formName,
  };
};

export const setFormFileFieldLabel = ({ taskName, label }) => {
  return {
    type: SET_FORM_FILE_FIELD_LABEL,
    payload: { taskName, label },
  };
};

export const clearFormFileFieldLabel = formName => {
  return {
    type: CLEAR_FORM_FILE_FIELD_LABEL,
    payload: formName,
  };
};

export const clearTrainToken = () => {
  return {
    type: TRAIN_TOKEN_CLEAR,
  };
};

export const setTrainConfig = ({ taskName, config }) => {
  const actionType = taskName === 'imageclassification' ? IC_CONFIG : SA_CONFIG;
  return {
    type: actionType,
    payload: config,
  };
};

export const setTrainDataSplit = ({ taskName, dataSplit }) => {
  const actionType =
    taskName === 'imageclassification' ? IC_DATA_SPLIT : SA_DATA_SPLIT;
  return {
    type: actionType,
    payload: dataSplit,
  };
};

export const setTrainModelType = ({ taskName, modelType }) => {
  const actionType =
    taskName === 'imageclassification' ? IC_MODEL_TYPE : SA_RNN_TYPE;
  return {
    type: actionType,
    payload: modelType,
  };
};

export const clearTrainData = taskName => dispatch => {
  dispatch(clearFormFileFieldLabel(taskName));
  dispatch({
    type: taskName === 'imageclassification' ? IC_DATA_CLEAR : SA_DATA_CLEAR,
  });
};

export const clearTrainConfig = taskName => dispatch => {
  dispatch(clearFormFileFieldLabel(taskName));
  dispatch({ type: taskName === 'imageclassification' ? IC_CLEAR : SA_CLEAR });
};

export const submitTrainRequest =
  ({ formName, trainConfig }) =>
  async dispatch => {
    if (formName) {
      dispatch(loadingForm(formName));
    }

    // Check server status
    const serverIsAvailable = await statusCheck();

    if (serverIsAvailable) {
      // Encode data
      const formData = new FormData();
      formData.append('training_data', JSON.stringify(trainConfig));

      // Processing the last url in list to display in webpage
      const response = await networkTransaction({
        url: '/train',
        formData,
        requestType: 'post',
        apiType: 'train',
      });

      if (checkResponse(response)) {
        dispatch({ type: TRAIN_TOKEN_SET, payload: response.data.token });
        dispatch(reset(formName));
      }
    } else {
      toastError(
        'Server is currently training another model! Please try again after a few minutes.'
      );
    }

    if (formName) {
      dispatch(clearLoadingForm(formName));
    }
  };

export const icAddClass = classNameValue => {
  return {
    type: IC_ADD_CLASS,
    payload: classNameValue,
  };
};

export const icDeleteClass = classNameValue => {
  return {
    type: IC_DELETE_CLASS,
    payload: classNameValue,
  };
};

export const icCurrentClass = classNameValue => {
  return {
    type: IC_CURRENT_CLASS,
    payload: classNameValue,
  };
};

export const icAddImages = ({
  imagesList,
  imagesListSize,
  imagesListPreview,
}) => {
  return {
    type: IC_ADD_IMAGES,
    payload: { imagesList, imagesListSize, imagesListPreview },
  };
};

export const saAddData = csvData => {
  return {
    type: SA_DATA_ADD,
    payload: csvData,
  };
};

export const clearInferenceConfig = () => {
  return {
    type: INFERENCE_CONFIG_CLEAR,
  };
};

export const clearInferencePrediction = () => {
  return { type: INFERENCE_PREDICTION_CLEAR };
};

export const clearInference = taskName => dispatch => {
  dispatch(clearFormFileFieldLabel(taskName));
  dispatch({ type: INFERENCE_CLEAR });
};

export const submitInferenceToken =
  ({ formName, token }) =>
  async dispatch => {
    if (formName) {
      dispatch(loadingForm(formName));
    }

    // Encode data
    const formData = new FormData();
    formData.append('token', JSON.stringify({ token }));

    const response = await networkTransaction({
      url: '/check',
      formData,
      requestType: 'post',
      apiType: 'inference',
    });

    if (checkResponse(response)) {
      dispatch({
        type: INFERENCE_CONFIG_SET,
        payload: {
          token,
          taskType: response.data.taskType,
          accuracy: response.data.accuracy,
          accuracyPlot: response.data.accuracyPlot,
        },
      });
    }

    if (formName) {
      dispatch(clearLoadingForm(formName));
    }
  };

export const submitInferenceData =
  ({ formName, formInput }) =>
  async dispatch => {
    if (formName) {
      dispatch(loadingForm(formName));
    }

    // Encode data
    const formData = new FormData();
    formData.append('inferenceInput', JSON.stringify(formInput));

    const response = await networkTransaction({
      url: '/inference',
      formData,
      requestType: 'post',
      apiType: 'inference',
      maxNumTries: 3,
    });

    if (checkResponse(response)) {
      dispatch({
        type: INFERENCE_SUBMIT,
        payload: response.data.prediction,
      });
    }

    if (formName) {
      dispatch(clearLoadingForm(formName));
    }
  };
