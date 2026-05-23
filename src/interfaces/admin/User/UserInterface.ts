export interface IUser {
    create(data: User): Promise<any>
    update(id: number, data: User): Promise<any>
    delete(id: number)
}

export type User = {
    name: string,
    email: string,
    password: string
} 