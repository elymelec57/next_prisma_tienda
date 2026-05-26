export interface ICategoria {
    create(data: Categoria): Promise<any>
    update(id: number, data: Categoria): Promise<any>
    delete(id: number): Promise<any>
    findById(id: number): Promise<any>
}

export interface IAllCategoria {
    all(): Promise<any[]>
}

export type Categoria = {
    nombre: string
}
