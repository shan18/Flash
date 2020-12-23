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

export const classifyAddImages = imagesList => {
  return {
    type: CLASSIFY_ADD_IMAGES,
    payload: imagesList,
  };
};

export const classifyClear = () => {
  return {
    type: CLASSIFY_CLEAR,
  };
};
