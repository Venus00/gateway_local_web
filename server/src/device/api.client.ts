import axios from 'axios';
import 'dotenv/config';

export const apiClient = axios.create({
  auth: {
    username: process.env.MQTT_AUTH_USERNAME || "",
    password: process.env.MQTT_AUTH_PASSWORD || "",
  },
  baseURL: `http://${process.env.API_BROKER}/api/v5`,
  headers: {
    'Content-type': 'application/json',
  },
});
