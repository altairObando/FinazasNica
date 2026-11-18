export interface BaseAccount {
    name:          string;
    description:   string;
    currency:      string;
    opening_price: number;
    limit_per_day: number;
    icon:          string;
    color:         string;
    is_active:     boolean;
}

export interface Account extends BaseAccount {
    id:            number;
    balance:       number;
    created_at:    Date;
    updated_at:    Date;
    created_by:    number;
    team:          number;
}
export interface NewAccount {
    team_id:       number;
}