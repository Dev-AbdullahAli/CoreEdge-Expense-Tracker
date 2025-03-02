export interface Group {
    id: string;
    name: string;
    user_id: string;
    created_at: string;
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    group_id: string;
    user_id: string;
    created_at: string;
}
