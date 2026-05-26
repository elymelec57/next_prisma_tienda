export interface IContorno {
    create(data: Contorno): Promise<any>
    update(id: number, data: Contorno): Promise<any>
    delete(id: number): Promise<any>
    findById(id: number): Promise<any>
}

export interface IAllContorno {
    all(): Promise<any[]>
}

export type Contorno = {
    nombre: string
}
