import { UpdatePlatoRepository } from "@/repositories/User/Plato/UpdatePlatoRepository";
import { SaveImageVercelService } from "@/services/Shared/File/SaveImageVercelService";
import deleteImage from "@/libs/deleteImage";

export class UpdatePlatoService {
    constructor(private platoRepository: UpdatePlatoRepository, private saveImageVercelService: SaveImageVercelService) { }

    async execute(id: number, form: any, image: File, mainImageId: string | null) {

        let plato = null;
        if (image) {
            const blob = await this.saveImageVercelService.saveImage('plato', image);
            const imageRecord = await this.platoRepository.createImage({
                blob: blob,
                id: 'Por_definir',
                model: "platos",
            });

            plato = await this.platoRepository.updateWithImage(id, {
                nombre: form.name,
                descripcion: form.description,
                precio: Number(form.price),
                categoriaId: Number(form.categoryId),
                contornos: form.contornos,
                sucursales: form.sucursales,
                mainImageId: imageRecord.id
            });

            await this.platoRepository.updateImage(imageRecord.id, String(plato.id));

            if (mainImageId) {
                const imageLast = await this.platoRepository.deleteImage(String(mainImageId));
                await deleteImage(imageLast.url)
            }
        } else {
            plato = await this.platoRepository.update(id, {
                nombre: form.name,
                descripcion: form.description,
                precio: Number(form.price),
                categoriaId: Number(form.categoryId),
                contornos: form.contornos,
                sucursales: form.sucursales
            });
        }

        if (!plato) {
            throw new Error('Error al editar');
        }
        return plato;
    }
}