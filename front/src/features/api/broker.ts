import { apiClient } from ".";

export   const fetchBrokers = async () => {
    try {
        const response = await apiClient.get('broker');
        return response.data;
    } catch (error) {
        return [];
    }
}