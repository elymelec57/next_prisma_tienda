import { IStorePlato } from "@/interfaces/User/Platos/StorePlatoInterface";

export class StorePlatoService {
    constructor(private storeRepository: IStorePlato) { }

    async execute(form: any, userId: number) {
        const rest = await this.storeRepository.RestaurantByUserId(userId);

        if (!rest) {
            throw new Error('Restaurante no encontrado');
        }

        const currentPlatos = rest._count.platos;
        const planLimit = rest.subscription?.plan?.productLimit || 10;

        if (currentPlatos >= planLimit) {
            throw new Error(`Has alcanzado el límite de productos (${planLimit}) para tu plan actual. Por favor, mejora tu plan.`);
        }

        const plato = await this.storeRepository.create({
            nombre: form.name,
            descripcion: form.description,
            precio: Number(form.price),
            restaurantId: rest.id,
            categoriaId: Number(form.categoryId),
            contornos: form.contornos,
            sucursales: form.sucursales
        });

        if (!plato) {
            throw new Error('Ocurrio en error inesperado');
        }

        return plato;
    }
}