import axios, { AxiosError } from 'axios';
import { getValue, removeValue } from './secureStore';

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use( async(config) =>{
    const token = await getValue('api_token');
    if( token ){
        config.headers.Authorization = `Bearer ${token}`
    };
    return config;
}, error => {
    return Promise.reject(error);
});

const AUTH_LOGIN_PATH = '/auth/login';

api.interceptors.response.use(
    response =>  response,
    async (error: AxiosError<{ detail?: unknown }>) => {
        const status = error.response?.status;
        const isLoginRequest = error.config?.url?.includes(AUTH_LOGIN_PATH) ?? false;

        if (status === 401 && !isLoginRequest) {
            console.log('La sesión expiró o el token es inválido.');
            await removeValue('api_token');
        }

        const detail = error.response?.data?.detail;
        if (typeof detail === 'string' && detail) {
            return Promise.reject(detail);
        }
        return Promise.reject(error);
    }
)
export default api;