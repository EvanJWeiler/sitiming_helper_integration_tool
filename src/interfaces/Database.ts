export interface Race {
    id: string;
    name: string;
}

export interface Racer {
    id: string;
    name: string;
    teamName: string;
    bibNumber: number;
    categoryId: string;
    checkedIn: boolean;
}

export interface Category {
    id: string;
    name: string;
}