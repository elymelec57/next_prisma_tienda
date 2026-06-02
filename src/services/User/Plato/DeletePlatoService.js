export class DeletePlatoService {
    constructor(platoRepository) {
        this.platoRepository = platoRepository;
    }

    async execute(id, deleteImageCallback) {
        //const plato = await this.platoRepository.findById(id);
        // if (!plato) {
        //     throw new Error('Plato no encontrado');
        // }
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