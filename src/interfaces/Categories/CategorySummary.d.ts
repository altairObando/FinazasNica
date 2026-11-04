import { Category } from "./Category";

export interface CategorySummary {
    total:   number;
    income:  number;
    expense: number;
    items:   Category[];
}