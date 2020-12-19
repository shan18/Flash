import {
  LOADING_FORM,
  CLEAR_LOADING_FORM,
  IMAGE_ADD_CLASS,
  IMAGE_DELETE_CLASS,
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

export const imageAddClass = classNameValue => {
  return {
    type: IMAGE_ADD_CLASS,
    payload: classNameValue,
  };
};

export const imageDeleteClass = classNameValue => {
  return {
    type: IMAGE_DELETE_CLASS,
    payload: classNameValue,
  };
};
