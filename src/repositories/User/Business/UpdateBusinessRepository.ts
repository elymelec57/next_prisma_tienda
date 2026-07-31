import { prisma } from "@/libs/prisma";
import { IUpdateBusiness } from "@/interfaces/User/Business/UpdateBusinessInterface";

export class UpdateBusinessRepository implements IUpdateBusiness {
    async updateBusiness(userId: number, data: any, slug: string) {
        return await prisma.restaurant.update({
            where: {
                userId: userId
            },
            data: {
                name: data.name,
                slogan: data.slogan,
                direcction: data.direcction,
                phone: data.phone,
                currency: data.currency,
                slug: slug,
                categoriaRestaurant: {
                    set: data.categoriaRestaurant?.map((id: any) => ({ id: Number(id) })) || []
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
                countryId: data.countryId ? Number(data.countryId) : null,
                stateId: data.stateId ? Number(data.stateId) : null,
                cityId: data.cityId ? Number(data.cityId) : null,
            },
        });
    }

    async createImage(data: any) {
        return await prisma.image.create({
            data: {
                url: data.blob.pathname,
                modelId: String(data.id),
                modelType: data.model,
                altText: 'Imagen que pertenece al ' + data.model,
            }
        });
    }

    async updateBusinessImage(restaurantId: number, imageId: string) {
        return await prisma.restaurant.update({
            where: {
                id: restaurantId
            },
            data: {
                mainImageId: imageId
            }
        });
    }

    async deleteImage(imageId: string) {
        return await prisma.image.delete({
            where: {
                id: imageId
            }
        });
    }
}