import axios from 'axios';
import 'dotenv/config';
export const apiClient = axios.create({
    baseURL: `${process.env.WORKFLOW_URL}`,
    headers: {
        'Content-type': 'application/json',
    },
});
