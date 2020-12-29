import axios from 'axios';

export default axios.create({
  baseURL: 'https://lqhhrn6qlb.execute-api.us-east-1.amazonaws.com/dev',
  headers: {
    post: {
      'Content-Type': 'multipart/form-data',
    },
  },
});
