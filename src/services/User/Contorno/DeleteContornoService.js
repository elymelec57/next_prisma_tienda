export class DeleteContornoService {
    constructor(contornoRepository) {
        this.contornoRepository = contornoRepository;
    }

    async execute(id) {
        const contorno = await this.contornoRepository.delete(id);
        if (!contorno) {
            throw new Error('Error al eliminar');
        }
        return contorno;
    }
}
