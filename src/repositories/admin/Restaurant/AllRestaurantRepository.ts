import { prisma } from "@/libs/prisma";
import { IAllRestaurant } from "@/interfaces/admin/Restaurant/RestaurantInterface";

export class AllRestaurantRepository implements IAllRestaurant {
    async all(): Promise<any[]> {
        return await prisma.restaurant.findMany();
    }
}
