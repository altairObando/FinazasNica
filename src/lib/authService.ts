import { LoginRequest, LoginResponse, User } from '@/interfaces/Auth';
import { AxiosResponse } from 'axios';
import api from './apiClient';
import { removeValue, setValue } from './secureStore';

export const authService = {
    login: async ( req: LoginRequest  ) =>{
        const response: AxiosResponse<LoginResponse> = await api.post('/auth/login', req );
        if(response.status === 401){
            throw new Error('Credenciales inválidas')
        }
        await setValue('api_token', response.data.token )
        return true;
    },
    logout: async ()=>{
        await api.post('/auth/logout');
        await removeValue('api_token');
    },
    me: async()=>{
        const response: AxiosResponse<User> = await api.get('/auth/me');
        return response.data;
    }
}