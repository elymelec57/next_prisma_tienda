export class SucursalService {
    constructor(sucursalRepository) {
        this.sucursalRepository = sucursalRepository;
    }

    async getSucursalesByRestaurantId(restaurantId) {
        return await this.sucursalRepository.findAllByRestaurantId(restaurantId);
    }

    async getSucursalById(id) {
        return await this.sucursalRepository.findById(id);
    }

    async createSucursal(data) {
        if (!data.nombre || !data.direccion || !data.restaurantId) {
            throw new Error('Faltan campos obligatorios');
        }
        return await this.sucursalRepository.create(data);
    }

    async updateSucursal(id, data) {
        return await this.sucursalRepository.update(id, data);
    }

    async deleteSucursal(id) {
        return await this.sucursalRepository.delete(id);
    }
}
