export interface ISubscription {
    create(data: Subscription): Promise<any>
    update(id: number, data: any): Promise<any>
    delete(id: number): Promise<any>
    findById(id: number): Promise<any>
}

export interface IAllSubscription {
    all(): Promise<any[]>
}

export type Subscription = {
    restaurantId: number
    planId: number
    status: string
    startDate: Date
    endDate: Date
}
