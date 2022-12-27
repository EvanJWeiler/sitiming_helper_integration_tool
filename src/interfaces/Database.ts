export interface Race {
    id: string;
    name: string;
}

export interface Racer {
    id: string;
    name: string;
    teamName: string;
    bibNumber: number;
    class: string;
}

export interface Category {
    id: string;
    name: string;
    courseId: string;
}