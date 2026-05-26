export interface ICategoriaIngrediente {
    create(data: CategoriaIngrediente): Promise<any>
    update(id: number, data: CategoriaIngrediente): Promise<any>
    delete(id: number): Promise<any>
    findById(id: number): Promise<any>
}

export interface IAllCategoriaIngrediente {
    all(): Promise<any[]>
}

export type CategoriaIngrediente = {
    nombre: string
}
