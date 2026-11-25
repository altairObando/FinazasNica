import { Account, AccountSummary, BaseAccount, ExchangeRate, NewAccount } from '@/interfaces/Accounts/Account'
import { Paginated } from "@/interfaces/general/paginated"
import { AxiosResponse } from "axios"
import api from "./apiClient"

export const accountService = {
    get: async ({ page = 0, size = 10, team_id }: { page: number, size: number, team_id?: number })=>{
        const params = new URLSearchParams();
        params.append('offset', String(page * size) );
        params.append('limit', String(size));
        if( team_id && team_id != null )
            params.append('team_id', String(team_id));
        const response: AxiosResponse<Paginated<Account>> = await api.get('/accounts/', { params })
        return response.data;
    },
    getById: async({ id }: { id: number }): Promise<Account> =>{
        const response = await api.get(`/accounts/${ id }`);
        return response.data;
    },
    add: async( entity: NewAccount )=>{
        const response : AxiosResponse<Account> = await api.post('/accounts/', entity );
        if( response.status != 201 && !response.data.id )
            throw new Error('No ha sido posible registrar la cuenta')
        return response.data;
    },
    update: async(id: number, entity: BaseAccount )=>{
        const response: AxiosResponse<Account> = await api.patch('/accounts/' + id, entity );
        if( response.status != 201 && !response.data.id )
            throw new Error('No ha sido posible actualizar la cuenta')
        return response.data;
    },
    exchange_rate: async() : Promise<ExchangeRate[]>=>{
        const response: AxiosResponse<ExchangeRate[]> = await api.get('/accounts/exchange_rate');
        return response.data;
    },
    summary: async({ teamId }:{ teamId: number }): Promise<AccountSummary[]>=>{
        const params = new URLSearchParams();
        params.append('team_id', String(teamId));
        const response = await api.get('/accounts/summary', { params });
        return response.data;
    }
}