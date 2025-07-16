import axios from 'axios';

const api = axios.create({
  baseURL: 'https://estadisticas-api.desarrollo-software.xyz/', 
});

export default api;
