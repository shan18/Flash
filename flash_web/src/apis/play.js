import axios from 'axios';

export default axios.create({
  headers: {
    post: {
      'Content-Type': 'multipart/form-data',
    },
  },
});
