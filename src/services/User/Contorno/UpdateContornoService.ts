import { IUpdateContorno } from "@/interfaces/User/Contornos/UpdateContornoInterface";

export class UpdateContornoService {
    constructor(private contornoRepository: IUpdateContorno) { }

    async execute(id: number, form: any): Promise<any> {
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
