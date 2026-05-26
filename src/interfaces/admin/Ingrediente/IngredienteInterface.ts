export interface IIngrediente {
    create(data: Ingrediente): Promise<any>
    update(id: number, data: Ingrediente): Promise<any>
    delete(id: number): Promise<any>
    findById(id: number): Promise<any>
}

export interface IAllIngrediente {
    all(): Promise<any[]>
}

export type Ingrediente = {
    nombre: string
    categoriaIngredienteId: number
}
