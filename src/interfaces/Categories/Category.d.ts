export interface Category {
    id:          number;
    is_active:   boolean;
    created_at:  Date;
    updated_at:  Date;
    icon:        string;
    color:       string;
    created_by:  number;
    team:        number;
    name:        string;
    description: string;
    type:        string;
}