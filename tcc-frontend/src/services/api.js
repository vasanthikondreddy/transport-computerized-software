import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // or your deployed URL
});


API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  console.log('Attaching token:', token); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
