import { API_ENDPOINTS } from '../constants';

const { BASE_URL, HEALTH } = API_ENDPOINTS;

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`Server responded with status: ${response.status}`);
  }
  return response.ok;
};

export const api = {
  checkHealth: () => 
    fetch(`${BASE_URL}${HEALTH}`).then(handleResponse)
};

export default api;
