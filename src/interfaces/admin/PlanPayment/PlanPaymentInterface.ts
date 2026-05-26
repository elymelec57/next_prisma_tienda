export interface IPlanPayment {
    findById(id: number): Promise<any>
    update(id: number, data: any): Promise<any>
    createSubscription(data: any): Promise<any>
}

export interface IAllPlanPayment {
    all(): Promise<any[]>
}
