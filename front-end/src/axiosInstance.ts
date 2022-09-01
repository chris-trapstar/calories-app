import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    if (!config.headers.Authorization) {

      /** Normal User JWT */
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3ROYW1lIjoiYSIsImxhc3ROYW1lIjoiYiIsInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJ0ZXN0In0.kPx6rJw9_XPsdId652gYKDKZseHRMKVRgrWhQ16Wvew';
      
      /** Admin User JWT */
      // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZmlyc3ROYW1lIjoiYSIsImxhc3ROYW1lIjoiYiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoidGVzdDIifQ.A6Jo9WrBa70GW_U0jU6nMupK4NeldxY8Uidj5YMtTrg';

      /** Todo: Need to fetch token from localStorage or sessionStorage */
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    return config;
  },
  error => Promise.reject(error))

export default axiosInstance;
