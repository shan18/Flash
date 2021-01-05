import axios from 'axios';

export default axios.create({
  baseURL: 'https://6yjieipsd1.execute-api.us-east-1.amazonaws.com/dev',
  headers: {
    post: {
      'Content-Type': 'multipart/form-data',
    },
  },
});
