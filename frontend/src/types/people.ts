export interface Person {
    name: string;
    surname: string;
    patronymic: string;
    phone: string;
}

export interface Student {
    id: number;
    person: Person;
    yearStarted: number;
    financialForm: 'BUDGET' | 'CONTRACT';
}
