import { NextResponse } from "next/server";
import { StoreBusinessRepository } from "@/repositories/User/Business/StoreBusinessRepository";
import { StoreBusinessService } from "@/services/User/Business/StoreBusinessService";
import { authorizeRequest } from '@/libs/auth';
import { SaveImageVercelService } from "@/services/Shared/File/SaveImageVercelService";
import jwt from "jsonwebtoken";

const storeBusinessRepository = new StoreBusinessRepository();
const saveImageVercelService = new SaveImageVercelService();
const storeBusinessService = new StoreBusinessService(storeBusinessRepository, saveImageVercelService);

export async function POST(request: any) {

    const user = await authorizeRequest(request)

    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    try {
        //const { form, userId } = await request.json();
        const formData = await request.formData();
        //const form = JSON.parse(formData.get('form'));
        const image = formData.get('image')
        const userId = user.auth.id;

        const result = await storeBusinessService.execute(formData, userId, image);

        if (result.status) {
            // Re-sign the JWT with the new restaurantId and update the cookie
            const updatedUserData = {
                ...user.auth,
                restaurantId: result.restaurantId,
            };

            const newToken = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 8),
                    data: updatedUserData,
                },
                process.env.JWT_TOKEN as string
            );

            const response = NextResponse.json(result);
            response.cookies.set('token', newToken, {
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 8, // 8 hours
                sameSite: 'strict',
            });

            return response;
        }

        return NextResponse.json({ status: false, message: result.message }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}