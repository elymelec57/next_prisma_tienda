export class UpdateContornoService {
    constructor(contornoRepository) {
        this.contornoRepository = contornoRepository;
    }

    async execute(id, form) {
        const contorno = await this.contornoRepository.update(id, {
            nombre: form.name,
            price: Number(form.price),
        });

        if (!contorno) {
            throw new Error('Error al editar');
        }

        return contorno;
    }
}
