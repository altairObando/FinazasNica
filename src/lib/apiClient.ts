import axios, { AxiosError } from 'axios';
import { getValue } from './secureStore';

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

api.interceptors.response.use(
    response =>  response,
    async error => {
        console.log(error?.message ?? 'ERROR NO CONTROLADO');
        if ( error.response && error.response.status === 401){
            console.log('El token expiró o es inválido. Redirigir al Login.');
            // await removeValue('api_token');
        }
        if( error instanceof AxiosError){
            let detail = error.response?.data?.detail;
            if (detail)
                return Promise.reject(detail);
        }
        return Promise.reject(error);
    }
)
export default api;