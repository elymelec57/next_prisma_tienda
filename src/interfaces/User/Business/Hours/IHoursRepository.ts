export interface IRestaurantHour {
    id: number;
    restaurantId: number;
    sucursalId?: number | null;
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
}

export interface IHourInput {
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
}

export interface ISaveHoursData {
    restaurantId: number | string;
    sucursalId?: number | string | null;
    hours: IHourInput[];
}

export interface IHoursRepository {
    saveHours(data: ISaveHoursData): Promise<IRestaurantHour[]>;
}
