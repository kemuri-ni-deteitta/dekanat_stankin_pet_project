import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Перехватчик для добавления JSESSIONID в заголовки запроса
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.request.use(
    (config) => {
        const fullUrl = config.baseURL + config.url;
        console.log('Full Request URL:', fullUrl);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log('Response:', response);
        return response;
    },
    (error) => {
        console.log('Response Error:', error);
        return Promise.reject(error);
    }
);

export default api;
