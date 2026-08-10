export interface IDataEmployee {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    password: string;
    rolId: number;
    userId: number;
    restaurantId: number;
}

export interface IStoreEmployeeRepository {
    create(data: any): Promise<any>;
}