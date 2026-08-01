export interface IPaymentMethod {
    id: string;
    restaurantId: number;
    type: string;
    label: string;
    ownerName: string;
    ownerId?: string | null;
    bankName?: string | null;
    accountNumber?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreatePaymentMethodData {
    type: string;
    label: string;
    ownerName: string;
    ownerId?: string;
    bankName?: string;
    accountNumber?: string;
    phoneNumber?: string;
    email?: string;
    isActive?: boolean;
    restaurantId: number;
}

export interface IUpdatePaymentMethodData extends Partial<Omit<ICreatePaymentMethodData, 'restaurantId'>> { }

export interface IPaymentMethodRepository {
    findAllByRestaurantId(restaurantId: number | string): Promise<IPaymentMethod[]>;
    create(data: ICreatePaymentMethodData): Promise<IPaymentMethod>;
    update(id: string, data: IUpdatePaymentMethodData): Promise<IPaymentMethod>;
    delete(id: string): Promise<IPaymentMethod>;
}
