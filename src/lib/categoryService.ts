import { Category, CategoryPaginated } from '@/interfaces/Categories/Category';
import { CategorySummary } from '@/interfaces/Categories/CategorySummary';
import { AxiosResponse } from 'axios';
import api from './apiClient';

export const categoryService = {
    get: async({ page = 0, size = 10, type = 'OUT' }): Promise<CategoryPaginated> =>{
        const params = new URLSearchParams();
        params.append('offset', String(page * size) );
        params.append('limit', String(size));
        params.append('type', type);
        const response: AxiosResponse<CategoryPaginated> = await api.get('/categories/', { params });
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