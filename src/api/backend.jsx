/**
 * Declaracion de dependencias
 */
import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * Componente de acceso a api de backend
 */
const Axios = axios.create({
  baseURL: 'http://localhost:3500/api',
  headers: {
    "Content-type": "application/json"
  }
});
Axios.interceptors.response.use(response => response, function (error) {
  console.log(error);
  throw error;
});
export default Axios;