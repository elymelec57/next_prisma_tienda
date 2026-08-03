export interface IRestaurantHour {
    id: number;
    restaurantId: number;
    sucursalId?: number | null;
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
}

export interface IHourInput {
    dayOfWeek: number;
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
