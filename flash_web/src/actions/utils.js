import { toast } from 'react-toastify';
import { MdError } from 'react-icons/md';

import trainApi from '../apis/train';
import inferApi from '../apis/infer';

export const networkTransaction = async ({
  url,
  formData,
  requestType,
  maxNumTries,
  apiType,
}) => {
  let response = null;
  let numTries = 0;

  let api = inferApi;
  if (apiType === 'train') {
    api = trainApi;
  }

  if (!maxNumTries) {
    maxNumTries = 1;
  }

  while (numTries >= 0 && numTries < maxNumTries) {
    try {
      if (requestType === 'post') {
        response = await api.post(url, formData);
      } else {
        response = await api.get(url);
      }
      numTries = -1;
    } catch (error) {
      console.log(error);
      numTries++;
    }
  }
  return response;
};

export const statusCheck = async () => {
  const response = await networkTransaction({
    url: '/status',
    requestType: 'get',
    apiType: 'train',
  });
  return response.data.status !== 'active';
};

export const toastError = message => {
  toast.dark(
    <div>
      <MdError size={25} color="yellow" />
      &nbsp; {message}
    </div>
  );
};

export const checkResponse = response => {
  if (response && response.data) {
    if (response.data.result === 'success') {
      return true;
    } else if (response.data.result === 'error') {
      toastError(response.data.message);
    } else {
      toastError('500: Internal Server Error!');
    }
  } else {
    toastError('500: Internal Server Error!');
  }
  return false;
};

export const correctTaskTypeCase = taskType => {
  return taskType === 'imageclassification'
    ? 'imageClassification'
    : 'textClassification';
};
