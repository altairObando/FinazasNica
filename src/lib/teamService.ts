import { JoinWithCodeRequest, NewTeamRequest, NewTeamResponse, TeamMembersRequest, TeamMembersResponse } from '@/interfaces/Profile/Team';
import { AxiosResponse } from 'axios';
import api from './apiClient';

export const teamService = {
    startTeam: async( request: NewTeamRequest) : Promise<NewTeamResponse> => {
        const response: AxiosResponse<NewTeamResponse> = await api.post('/teams/starter_team', request);
        return response.data;
    },
    joinToTeam: async ( request: JoinWithCodeRequest) : Promise<NewTeamResponse> => {
        const response: AxiosResponse<NewTeamResponse> = await api.post('/teams/join', request);
        return response.data;
    },
    getMembers: async( request: TeamMembersRequest ): Promise<TeamMembersResponse[]> => {
        const params = new URLSearchParams();
        params.append('team_code', request.team_code);
        const response: AxiosResponse<TeamMembersResponse[]> = await api.get('team-members/getByTeamCode',{ params: params });
        return response.data || [];
    }
}