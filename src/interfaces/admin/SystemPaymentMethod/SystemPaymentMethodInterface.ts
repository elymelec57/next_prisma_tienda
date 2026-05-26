export interface ISystemPaymentMethod {
    create(data: SystemPaymentMethod): Promise<any>
    update(id: string, data: SystemPaymentMethod): Promise<any>
    delete(id: string): Promise<any>
    findById(id: string): Promise<any>
}

export interface IAllSystemPaymentMethod {
    all(): Promise<any[]>
}

export type SystemPaymentMethod = {
    type: string
    active: boolean
    config?: any
    restaurantId?: number | null
}
