import { ISucursalRepository, ICreateSucursalData, IUpdateSucursalData, ISucursal } from '@/interfaces/User/Business/Sucursal/ISucursalRepository';

export class SucursalService {
    constructor(private readonly sucursalRepository: ISucursalRepository) {}

    async getSucursalesByRestaurantId(restaurantId: number | string): Promise<ISucursal[]> {
        return await this.sucursalRepository.findAllByRestaurantId(restaurantId);
    }

    async getSucursalById(id: number | string): Promise<ISucursal | null> {
        return await this.sucursalRepository.findById(id);
    }

    async createSucursal(data: ICreateSucursalData): Promise<ISucursal> {
        if (!data.nombre || !data.direccion || !data.restaurantId) {
            throw new Error('Faltan campos obligatorios: nombre, dirección y restaurantId');
        }
        return await this.sucursalRepository.create(data);
    }

    async updateSucursal(id: number | string, data: IUpdateSucursalData): Promise<ISucursal> {
        return await this.sucursalRepository.update(id, data);
    }

    async deleteSucursal(id: number | string): Promise<ISucursal> {
        return await this.sucursalRepository.delete(id);
    }
}
