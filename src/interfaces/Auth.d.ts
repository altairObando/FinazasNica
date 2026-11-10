export interface LoginRequest {
    username: string
    password: string
}
export interface LoginResponse {
    token: string
}
export interface User {
    id: number
    username: string
    email: string
    name: string
    surname: string
    phone: string
    team_id: number,
    team_code: string
    team_name: string
    other_teams: [string]
    members: number

}