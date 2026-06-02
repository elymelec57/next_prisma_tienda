export class UpdatePlatoService {
    constructor(platoRepository) {
        this.platoRepository = platoRepository;
    }

    async execute(id, form) {
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