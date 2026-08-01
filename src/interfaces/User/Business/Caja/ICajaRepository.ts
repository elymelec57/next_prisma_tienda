export interface ICaja {
    id: number;
    nombre: string;
    restaurantId: number;
    sucursalId?: number | null;
    estado: string;
    balanceActual: number;
    createdAt?: Date;
    updatedAt?: Date;
    sucursal?: any;
    turnos?: ITurnoCaja[];
}

export interface ICreateCajaData {
    nombre: string;
    restaurantId: number;
    sucursalId?: number | null;
    estado?: string;
    balanceActual?: number;
}

export interface IUpdateCajaData {
    nombre?: string;
    sucursalId?: number | null;
    estado?: string;
    balanceActual?: number;
}

export interface ITurnoCaja {
    id: number;
    cajaId: number;
    empleadoId: number;
    montoApertura: number;
    montoCierre?: number | null;
    fechaApertura: Date;
    fechaCierre?: Date | null;
    estado: string;
    empleado?: any;
}

export interface IOpenShiftData {
    cajaId: number;
    empleadoId: number;
    montoApertura: number;
}

export interface ICloseShiftData {
    montoCierre: number;
}

export interface ICajaRepository {
    create(data: ICreateCajaData): Promise<ICaja>;
    update(id: number | string, data: IUpdateCajaData): Promise<ICaja>;
    delete(id: number | string): Promise<ICaja>;
    findById(id: number | string): Promise<ICaja | null>;
    findByRestaurant(restaurantId: number | string): Promise<ICaja[]>;
    openShift(data: IOpenShiftData): Promise<ITurnoCaja>;
    closeShift(id: number | string, data: ICloseShiftData): Promise<ITurnoCaja>;
}
