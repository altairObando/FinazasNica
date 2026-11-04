import { Category } from '@/interfaces/Categories/Category';
import { CategorySummary } from '@/interfaces/Categories/CategorySummary';
import { AxiosResponse } from 'axios';
import api from './apiClient';

export const categoryService = {
    get: async(): Promise<Category[]> =>{
        const response: AxiosResponse<Category[]> = await api.get('/categories');
        return response.data;
    },
    getById: async(id: number): Promise<Category> =>{
        const response: AxiosResponse<Category> = await api.get('/categories/'+ id );
        return response.data;
    },
    summary: async (team_code: string): Promise<CategorySummary> =>{
        const params = new URLSearchParams();
        params.append('team_code', team_code);
        const response: AxiosResponse<CategorySummary> = await api.get('/categories/summary', { params });
        return response.data;
    }
}