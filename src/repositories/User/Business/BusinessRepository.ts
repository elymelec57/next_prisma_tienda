import { prisma } from "@/libs/prisma";
import { IBusinessRepository } from "@/interfaces/User/Business/BusinessInterface";

export class BusinessRepository implements IBusinessRepository {
    async getBusinessByUserId(userId: number) {
        return await prisma.restaurant.findUnique({
            where: {
                userId: userId
            },
            include: {
                restaurantHours: {
                    orderBy: {
                        dayOfWeek: 'asc'
                    }
                },
                paymentMethods: true,
                categoriaRestaurant: true
            }
        });
    }

    async getImageById(imageId: string) {
        return await prisma.image.findUnique({
            where: {
                id: imageId
            },
            select: {
                id: true,
                url: true
            }
        });
    }
}
