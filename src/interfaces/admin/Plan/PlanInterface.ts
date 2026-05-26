export interface IPlan {
    create(data: Plan): Promise<any>
    update(id: number, data: Plan): Promise<any>
    delete(id: number): Promise<any>
    findById(id: number): Promise<any>
}

export interface IAllPlan {
    all(): Promise<any[]>
}

export type Plan = {
    name: string
    description?: string
    price: number
    productLimit: number
}
