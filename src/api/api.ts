import axios from 'axios';

const api = axios.create({
  baseURL: 'https://estadisticas-api.desarrollo-software.xyz/', // cambia si tu backend está en otra URL
});

export default api;
