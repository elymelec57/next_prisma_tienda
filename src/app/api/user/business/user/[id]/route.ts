import { NextResponse } from "next/server";
import { BusinessRepository } from "@/repositories/User/Business/BusinessRepository";
import { BusinessService } from "@/services/User/Business/BusinessService";
import { authorizeRequest } from '@/libs/auth';
import { UpdateBusinessService } from "@/services/User/Business/UpdateBusinessService";
import { SaveImageVercelService } from "@/services/Shared/File/SaveImageVercelService";
import { UpdateBusinessRepository } from "@/repositories/User/Business/UpdateBusinessRepository";

const businessRepository = new BusinessRepository();
const businessService = new BusinessService(businessRepository);
const saveImageService = new SaveImageVercelService();

export async function GET(request: any, segmentData: any) {
    const params = await segmentData.params;

    try {
        const result = await businessService.getBusiness(Number(params.id));
        if (!result.status) {
            return NextResponse.json({ status: false, message: result.message });
        }

        return NextResponse.json({ status: true, rest: result.rest });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(request: any, segmentData: any) {

    const user = await authorizeRequest(request)

    if (!user || !user.authorized) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }

    const params = await segmentData.params;

    try {
        const formData = await request.formData();
        //const form = JSON.parse(formData.get('form'));
        const mainImageId = formData.get('mainImageId');
        const image = formData.get('image')
        const userId = user.auth.id;

        const updateBusinessRepository = new UpdateBusinessRepository();
        const updateBusinessService = new UpdateBusinessService(updateBusinessRepository, saveImageService);
        const result = await updateBusinessService.execute(Number(params.id), formData, image, mainImageId);

        if (result.status) {
            return NextResponse.json(result);
        }

        return NextResponse.json({ status: false, message: result.message });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}