import { IStoreContorno } from "@/interfaces/User/Contornos/StoreContornoInterface";

export class StoreContornoService {
    constructor(private storeRepository: IStoreContorno) {
    }

    async execute(form: any, userId: number, selectedSucursal: any) {
        const rest = await this.storeRepository.RestaurantByUserId(userId);
        if (!rest) {
            throw new Error('Restaurante no encontrado');
        }

        let contorno;
        if (selectedSucursal === undefined) {
            contorno = await this.storeRepository.create({
                nombre: form.name,
                price: Number(form.price),
                restaurantId: rest.id,
            });
        }
        else {
            contorno = await this.storeRepository.createContornoSucursal({
                nombre: form.name,
                price: Number(form.price),
                restaurantId: rest.id,
                sucursalId: Number(selectedSucursal),
            });
        }

        if (!contorno) {
            throw new Error('Ocurrió un error inesperado');
        }

        return contorno;
    }
}
