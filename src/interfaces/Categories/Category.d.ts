export type CategoryType = 'IN' | 'OUT';

export interface BaseCategory {
    name: string;
    description: string;
    type: CategoryType;
    icon: string;
    color: string;
    is_active: boolean
}

export interface Category extends BaseCategory {
    id:          number;
    team:        number;
    created_at:  Date;
    updated_at:  Date;
    created_by:  number;
}

export interface CategoryPaginated {
    items: Category[];
    count: number;
}

export interface NewCategory extends BaseCategory {
    team_id: number;
}
