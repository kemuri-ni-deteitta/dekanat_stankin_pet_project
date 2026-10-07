export interface Person {
    surname: string;
    name: string;
    patronymic: string;
    phone: string;
}

export interface Employee {
    id: number;
    person: Person;
    position: string;
    credentialsNonExpired: boolean;
    kafedraId: number;
}
