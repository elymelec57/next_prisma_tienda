export class PlatoService {
    constructor(platoRepository, restaurantRepository) {
        this.platoRepository = platoRepository;
        this.restaurantRepository = restaurantRepository;
    }

    async getPlatosByRestaurant(restaurantId) {
        const currency = await this.restaurantRepository.getCurrency(restaurantId);
        const platos = await this.platoRepository.findAllByRestaurantId(restaurantId);
        const imageIds = platos.map((p) => p.mainImageId).filter((id) => id !== null);
        const categorias = await this.platoRepository.findCategoriesByRestaurantId(restaurantId);

        if (imageIds.length === 0) {
            const dataPlatos = platos.map((p) => ({ ...p, mainImage: null }));
            return { categorias, dataPlatos, currency };
        }

        const images = await this.platoRepository.findImagesByIds(imageIds);
        const imageMap = new Map(images.map((img) => [img.id, img]));

        const dataPlatos = platos.map((plato) => ({
            ...plato,
            mainImage: plato.mainImageId ? imageMap.get(plato.mainImageId) : null,
        }));

        return { categorias, dataPlatos, currency };
    }

    async getPlatoById(id) {
        const plato = await this.platoRepository.findById(id);
        if (!plato) return null;

        if (plato.mainImageId) {
            const image = await this.platoRepository.findImageById(plato.mainImageId);
            plato.url = image?.url || null;
        } else {
            plato.url = null;
        }

        return plato;
    }

    async createPlato(userId, form) {
        const rest = await this.restaurantRepository.findByUserId(userId);

        if (!rest) {
            throw new Error('Restaurante no encontrado');
        }

        const currentPlatos = rest._count.platos;
        const planLimit = rest.subscription?.plan?.productLimit || 10;

        if (currentPlatos >= planLimit) {
            throw new Error(`Has alcanzado el límite de productos (${planLimit}) para tu plan actual. Por favor, mejora tu plan.`);
        }

        const plato = await this.platoRepository.create({
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

    async updatePlato(id, form) {
        const plato = await this.platoRepository.update(id, {
            nombre: form.name,
            descripcion: form.description,
            precio: Number(form.price),
            categoriaId: Number(form.categoryId),
            contornos: form.contornos,
            sucursales: form.sucursales
        });

        if (!plato) {
            throw new Error('Error al editar');
        }

        return plato;
    }

    async deletePlato(id, deleteImageCallback) {
        const plato = await this.platoRepository.findById(id);
        if (!plato) {
            throw new Error('Plato no encontrado');
        }

        const platoDelete = await this.platoRepository.delete(id);

        if (platoDelete && platoDelete.mainImageId) {
            const image = await this.platoRepository.deleteImage(platoDelete.mainImageId);
            if (image && deleteImageCallback) {
                await deleteImageCallback(image.url);
            }
        }

        return platoDelete;
    }
}
