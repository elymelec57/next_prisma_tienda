import { IHoursRepository, ISaveHoursData, IRestaurantHour } from "@/interfaces/User/Business/Hours/IHoursRepository";

export class HoursService {
    constructor(private readonly hoursRepository: IHoursRepository) {}

    async saveHours(data: ISaveHoursData): Promise<IRestaurantHour[]> {
        if (!data.restaurantId || !data.hours || !Array.isArray(data.hours)) {
            throw new Error("Invalid data: restaurantId and hours array are required");
        }
        return await this.hoursRepository.saveHours(data);
    }
}
