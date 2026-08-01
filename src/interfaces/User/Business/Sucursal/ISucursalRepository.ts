export interface ISucursal {
    id: number;
    nombre: string;
    direccion: string;
    telefono?: string | null;
    lat?: number | null;
    lng?: number | null;
    restaurantId: number;
    deliveryFreeRange?: number | null;
    deliveryShortRange?: number | null;
    deliveryShortPrice?: number | null;
    deliveryMediumRange?: number | null;
    deliveryMediumPrice?: number | null;
    deliveryLongRange?: number | null;
    deliveryLongPrice?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreateSucursalData {
    nombre: string;
    direccion: string;
    telefono?: string;
    lat?: number | string | null;
    lng?: number | string | null;
    restaurantId: number | string;
    platos?: number[];
    deliveryFreeRange?: number | string | null;
    deliveryShortRange?: number | string | null;
    deliveryShortPrice?: number | string | null;
    deliveryMediumRange?: number | string | null;
    deliveryMediumPrice?: number | string | null;
    deliveryLongRange?: number | string | null;
    deliveryLongPrice?: number | string | null;
}

export interface IUpdateSucursalData extends Partial<ICreateSucursalData> {}

export interface ISucursalRepository {
    findAllByRestaurantId(restaurantId: number | string): Promise<ISucursal[]>;
    findById(id: number | string): Promise<ISucursal | null>;
    create(data: ICreateSucursalData): Promise<ISucursal>;
    update(id: number | string, data: IUpdateSucursalData): Promise<ISucursal>;
    delete(id: number | string): Promise<ISucursal>;
}
