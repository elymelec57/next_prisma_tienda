import { prisma } from "@/libs/prisma";
import { IHoursRepository, ISaveHoursData, IRestaurantHour } from "@/interfaces/User/Business/Hours/IHoursRepository";

export class HoursRepository implements IHoursRepository {
    async saveHours(data: ISaveHoursData): Promise<IRestaurantHour[]> {
        const { restaurantId, sucursalId, hours } = data;
        const results: IRestaurantHour[] = [];

        for (const hour of hours) {
            const existing = await prisma.restaurantHours.findFirst({
                where: {
                    restaurantId: Number(restaurantId),
                    sucursalId: sucursalId ? Number(sucursalId) : null,
                    dayOfWeek: hour.dayOfWeek,
                }
            });

            if (existing) {
                const updated = await prisma.restaurantHours.update({
                    where: { id: existing.id },
                    data: {
                        openTime: hour.openTime,
                        closeTime: hour.closeTime,
                        isOpen: hour.isOpen,
                    }
                });
                results.push(updated as IRestaurantHour);
            } else {
                const created = await prisma.restaurantHours.create({
                    data: {
                        restaurantId: Number(restaurantId),
                        sucursalId: sucursalId ? Number(sucursalId) : null,
                        dayOfWeek: hour.dayOfWeek,
                        openTime: hour.openTime,
                        closeTime: hour.closeTime,
                        isOpen: hour.isOpen,
                    }
                });
                results.push(created as IRestaurantHour);
            }
        }

        return results;
    }
}
