import Config from 'react-native-config';

import axios from 'axios';

export const client = axios.create({
  baseURL: Config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
