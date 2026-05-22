export interface PlanPaymentInterface {
    findAll(): Promise<any[]>;
    findById(id: number): Promise<any>;
    updateStatus(id: number, status: string): Promise<any>;
    upsertSubscription(data: any): Promise<any>;
}
