import { toast } from 'react-toastify';
import { MdError } from 'react-icons/md';

import api from '../apis';

export const networkTransaction = async ({
  url,
  formData,
  requestType,
  maxNumTries,
}) => {
  let response = null;
  let numTries = 0;

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
  });
  return response.data.status !== 'active';
};

export const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n) {
    u8arr[n - 1] = bstr.charCodeAt(n - 1);
    n -= 1; // to make eslint happy
  }
  return new File([u8arr], filename, { type: mime });
};

export const toastError = message => {
  toast.dark(
    <div>
      <MdError size={25} color="yellow" />
      &nbsp; {message}
    </div>
  );
};
