import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_INFER_LAMBDA_ENDPOINT,
  headers: {
    post: {
      'Content-Type': 'multipart/form-data',
    },
  },
});
