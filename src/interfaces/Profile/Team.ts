export interface NewTeamRequest {
    teamName: string,
    teamDescription: string,
    teamSecret: string,
    name: string,
    surname: string,
    phone: string,
    email: string,
}
export interface NewTeamResponse {
    id: number,
    code: string,
    name: string,
    description: string,
}
export interface JoinWithCodeRequest {
    teamCode: string,
    teamPass: string,
}

export interface TeamForm {
    onSubmit: ( data: NewTeamRequest | JoinWithCodeRequest )=> void
    parentLoading: boolean
}

export interface TeamMembersRequest { 
    team_code: string
}

export interface TeamMembersResponse {
    id: number,
    name: string
    is_owner: boolean
}