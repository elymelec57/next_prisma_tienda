export interface ICategoriaRestaurant {
    create(data: CategoriaRestaurant): Promise<any>
    update(id: number, data: CategoriaRestaurant): Promise<any>
    delete(id: number): Promise<any>
    findById(id: number): Promise<any>
}

export interface IAllCategoriaRestaurant {
    all(): Promise<any[]>
}

export type CategoriaRestaurant = {
    nombre: string
}
