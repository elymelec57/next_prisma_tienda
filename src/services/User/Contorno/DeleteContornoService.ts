import { IDeleteContorno } from "@/interfaces/User/Contornos/DeleteContornoInterface";

export class DeleteContornoService {
    constructor(private contornoRepository: IDeleteContorno) { }

    async execute(id: number) {
        const contorno = await this.contornoRepository.delete(id);
        if (!contorno) {
            throw new Error('Error al eliminar');
        }
        return contorno;
    }
}
