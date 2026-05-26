export interface IRol {
    create(data: Rol): Promise<any>
    update(id: number, data: Rol): Promise<any>
    delete(id: number): Promise<any>
    findById(id: number): Promise<any>
}

export interface IAllRol {
    all(): Promise<any[]>
}

export type Rol = {
    name: string
}
