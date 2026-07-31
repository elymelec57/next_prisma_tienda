import { NextResponse } from "next/server";
import { StoreBusinessRepository } from "@/repositories/User/Business/StoreBusinessRepository";
import { StoreBusinessService } from "@/services/User/Business/StoreBusinessService";
import { authorizeRequest } from '@/libs/auth';
import { SaveImageVercelService } from "@/services/Shared/File/SaveImageVercelService";

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
            return NextResponse.json(result);
        }

        return NextResponse.json({ status: false, message: result.message }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}