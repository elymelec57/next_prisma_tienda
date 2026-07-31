import { IStoreBusiness } from "@/interfaces/User/Business/StoreBusinessInterface";
import { prisma } from "@/libs/prisma";

export class StoreBusinessRepository implements IStoreBusiness {
    async createBusiness(data: any, slug: string, userId: number, imageId: string) {
        return await prisma.restaurant.create({
            data: {
                name: data.name,
                slogan: data.slogan,
                direcction: data.direcction,
                phone: data.phone,
                currency: data.currency || "USD",
                slug: slug,
                mainImageId: imageId,
                categoriaRestaurant: {
                    connect: data.categoriaRestaurant?.map((id: any) => ({ id: Number(id) })) || []
                },
                user: {
                    connect: {
                        id: userId,
                    },
                },
                lat: data.lat ? parseFloat(data.lat) : null,
                lng: data.lng ? parseFloat(data.lng) : null,
                deliveryFreeRange: data.deliveryFreeRange ? parseFloat(data.deliveryFreeRange) : null,
                deliveryShortRange: data.deliveryShortRange ? parseFloat(data.deliveryShortRange) : null,
                deliveryShortPrice: data.deliveryShortPrice ? parseFloat(data.deliveryShortPrice) : null,
                deliveryMediumRange: data.deliveryMediumRange ? parseFloat(data.deliveryMediumRange) : null,
                deliveryMediumPrice: data.deliveryMediumPrice ? parseFloat(data.deliveryMediumPrice) : null,
                deliveryLongRange: data.deliveryLongRange ? parseFloat(data.deliveryLongRange) : null,
                deliveryLongPrice: data.deliveryLongPrice ? parseFloat(data.deliveryLongPrice) : null,
                country: data.countryId ? { connect: { id: Number(data.countryId) } } : null,
                state: data.stateId ? { connect: { id: Number(data.stateId) } } : null,
                city: data.cityId ? { connect: { id: Number(data.cityId) } } : null,
            },
            include: {
                user: true,
                categoriaRestaurant: true
            },
        });
    }

    async createImage(data) {
        return await prisma.image.create({
            data: {
                url: data.blob.pathname,
                modelId: String(data.id),
                modelType: data.model,
                altText: 'Imagen que pertenece al ' + data.model,
            },
        });
    }

    async updateImage(id: string, modelId: string) {
        return await prisma.image.update({
            where: { id },
            data: { modelId }
        });
    }

    async updateBusinessImage(id: number, imageId: string) {
        return await prisma.restaurant.update({
            where: { id },
            data: { mainImageId: imageId }
        });
    }
}
