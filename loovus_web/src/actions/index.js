import {
  LOADING_FORM,
  CLEAR_LOADING_FORM,
  CLASSIFY_CONFIG,
  CLASSIFY_MODEL_TYPE,
  CLASSIFY_DATA_SPLIT,
  CLASSIFY_ADD_CLASS,
  CLASSIFY_DELETE_CLASS,
  CLASSIFY_CURRENT_CLASS,
  CLASSIFY_ADD_IMAGES,
  CLASSIFY_CLEAR,
} from './types';
import { networkTransaction } from './utils';

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

export const classifyTrain = ({
  url,
  formName,
  formData,
  requestType,
}) => async dispatch => {
  if (formName) {
    dispatch(loadingForm(formName));
  }

  // Default request type is post
  if (!requestType) {
    requestType = 'post';
  }

  // Processing the last url in list to display in webpage
  let response = await networkTransaction({
    url,
    formData,
    requestType,
  });

  // If response is null then this will avoid throwing error
  let responseData = response;
  if (response) {
    responseData = response.data;
  }

  console.log(responseData);

  if (formName) {
    dispatch(clearLoadingForm(formName));
  }
};
