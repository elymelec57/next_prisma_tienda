import { DeletePlatoRepository } from "@/repositories/User/Plato/DeletePlatoRepository";

export class DeletePlatoService {
    constructor(private platoRepository: DeletePlatoRepository) {
    }

    async execute(id: number, deleteImageCallback: Function) {
        const platoDelete = await this.platoRepository.delete(Number(id));

        if (platoDelete && platoDelete.mainImageId) {
            const image = await this.platoRepository.deleteImage(platoDelete.mainImageId);
            if (image && deleteImageCallback) {
                await deleteImageCallback(image.url);
            }
        }

        return platoDelete;
    }
}