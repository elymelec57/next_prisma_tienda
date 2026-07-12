import { UpdatePlatoRepository } from "@/repositories/User/Plato/UpdatePlatoRepository";

export class UpdatePlatoService {
    constructor(private platoRepository: UpdatePlatoRepository) {
    }

    async execute(id: number, form: any) {
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
}