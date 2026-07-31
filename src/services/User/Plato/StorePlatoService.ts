import { IStorePlato } from "@/interfaces/User/Platos/StorePlatoInterface";
import { SaveImageInterface } from "@/interfaces/Shared/File/SaveImageInterface";

export class StorePlatoService {
    constructor(
        private storeRepository: IStorePlato,
        private saveImageService: SaveImageInterface
    ) { }

    async execute(form: any, userId: number, image: File) {
        const rest = await this.storeRepository.RestaurantByUserId(userId);

        if (!rest) {
            throw new Error('Restaurante no encontrado');
        }

        const currentPlatos = rest._count.platos;
        const planLimit = rest.subscription?.plan?.productLimit || 10;

        if (currentPlatos >= planLimit) {
            throw new Error(`Has alcanzado el límite de productos (${planLimit}) para tu plan actual. Por favor, mejora tu plan.`);
        }

        const blob = await this.saveImageService.saveImage('platos', image);
        if (!blob) {
            throw new Error('Error al guardar la imagen');
        }

        const imageRecord = await this.storeRepository.createImage({
            blob: blob,
            id: 'Por_definir',
            model: "platos",
        });

        const plato = await this.storeRepository.create({
            nombre: form.name,
            descripcion: form.description,
            precio: Number(form.price),
            restaurantId: rest.id,
            categoriaId: Number(form.categoryId),
            contornos: form.contornos,
            sucursales: form.sucursales,
            mainImageId: String(imageRecord.id),
        });

        if (!plato) {
            throw new Error('Ocurrio en error inesperado');
        }

        await this.storeRepository.updateImage(imageRecord.id, String(plato.id));

        return plato;
    }
}