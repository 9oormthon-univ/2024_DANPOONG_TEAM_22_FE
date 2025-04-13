import axios from 'axios';
import Config from 'react-native-config';

export const client = axios.create({
  baseURL: Config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

