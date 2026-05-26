export interface IRestaurant {
    create(data: Restaurant): Promise<any>
    update(id: number, data: Restaurant): Promise<any>
    delete(id: number): Promise<any>
    findById(id: number): Promise<any>
}

export interface IAllRestaurant {
    all(): Promise<any[]>
}

export type Restaurant = {
    slug: string
    name: string
    slogan?: string
    phone?: string
    direcction?: string
    userId: number
    categoriaRestaurant?: number[]
    paymentMethods?: string[]
}
