export interface IRole {
    create(data: Role): Promise<any>
    update(id: number, data: Role): Promise<any>
    delete(id: number): Promise<any>
}

export type Role = {
    name: string
}
