export interface IDataEmployee {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    password: string;
    rolId: number;
    userId: number;
    restaurantId: number;
    sucursalId?: any;
}

export interface IStoreEmployeeRepository {
    create(data: IDataEmployee): Promise<any>;
}