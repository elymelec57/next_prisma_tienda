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
        const contornos = await this.platoRepository.AllContornos(restaurantId);
        const sucursales = await this.platoRepository.Allsucursales(restaurantId);

        if (imageIds.length === 0) {
            const dataPlatos = platos.map((p) => ({ ...p, mainImage: null }));
            return { categorias, dataPlatos, currency, contornos, sucursales };
        }

        const images = await this.platoRepository.findImagesByIds(imageIds);
        const imageMap = new Map(images.map((img) => [img.id, img]));

        const dataPlatos = platos.map((plato) => ({
            ...plato,
            mainImage: plato.mainImageId ? imageMap.get(plato.mainImageId) : null,
        }));

        return { categorias, dataPlatos, currency, contornos, sucursales };
    }

    // async getPlatoById(id) {
    //     const plato = await this.platoRepository.findById(id);
    //     if (!plato) return null;

    //     if (plato.mainImageId) {
    //         const image = await this.platoRepository.findImageById(plato.mainImageId);
    //         plato.url = image?.url || null;
    //     } else {
    //         plato.url = null;
    //     }

    //     return plato;
    // }
}
