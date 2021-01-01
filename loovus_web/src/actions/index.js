import { reset } from 'redux-form';

import {
  LOADING_FORM,
  CLEAR_LOADING_FORM,
  TRAIN_TOKEN_SET,
  TRAIN_TOKEN_CLEAR,
  CLASSIFY_CONFIG,
  CLASSIFY_MODEL_TYPE,
  CLASSIFY_DATA_SPLIT,
  CLASSIFY_ADD_CLASS,
  CLASSIFY_DELETE_CLASS,
  CLASSIFY_CURRENT_CLASS,
  CLASSIFY_ADD_IMAGES,
  CLASSIFY_CLEAR,
  INFERENCE_CONFIG_SET,
  INFERENCE_CONFIG_CLEAR,
  INFERENCE_SUBMIT,
} from './types';
import { networkTransaction, statusCheck, toastError } from './utils';

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

export const clearTrainToken = () => {
  return {
    type: TRAIN_TOKEN_CLEAR,
  };
};

export const classifyConfig = config => {
  return {
    type: CLASSIFY_CONFIG,
    payload: config,
  };
};

export const classifyModelType = modelType => {
  return {
    type: CLASSIFY_MODEL_TYPE,
    payload: modelType,
  };
};

export const classifyDataSplit = dataSplit => {
  return {
    type: CLASSIFY_DATA_SPLIT,
    payload: dataSplit,
  };
};

export const classifyAddClass = classNameValue => {
  return {
    type: CLASSIFY_ADD_CLASS,
    payload: classNameValue,
  };
};

export const classifyDeleteClass = classNameValue => {
  return {
    type: CLASSIFY_DELETE_CLASS,
    payload: classNameValue,
  };
};

export const classifyCurrentClass = classNameValue => {
  return {
    type: CLASSIFY_CURRENT_CLASS,
    payload: classNameValue,
  };
};

export const classifyAddImages = ({
  imagesList,
  imagesListSize,
  imagesListPreview,
}) => {
  return {
    type: CLASSIFY_ADD_IMAGES,
    payload: { imagesList, imagesListSize, imagesListPreview },
  };
};

export const classifyClear = () => {
  return {
    type: CLASSIFY_CLEAR,
  };
};

export const classifyTrain = ({ formName, trainConfig }) => async dispatch => {
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

    if (response && response.data) {
      if (response.data.result === 'success') {
        dispatch({ type: TRAIN_TOKEN_SET, payload: response.data.token });
        dispatch(reset(formName));
      } else if (response.data.result === 'error') {
        toastError(response.data.message);
      } else {
        toastError('500: Internal Server Error!');
      }
    } else {
      toastError('500: Internal Server Error!');
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

export const clearInferenceConfig = () => {
  return {
    type: INFERENCE_CONFIG_CLEAR,
  };
};

export const submitInferenceToken = ({ formName, token }) => async dispatch => {
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

  if (response && response.data) {
    if (response.data.result === 'success') {
      dispatch({
        type: INFERENCE_CONFIG_SET,
        payload: { token, taskType: response.data.taskType },
      });
    } else if (response.data.result === 'error') {
      toastError(response.data.message);
    } else {
      toastError('500: Internal Server Error!');
    }
  } else {
    toastError('500: Internal Server Error!');
  }

  if (formName) {
    dispatch(clearLoadingForm(formName));
  }
};
