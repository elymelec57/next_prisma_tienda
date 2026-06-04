import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { ProfileRepository } from "@/repositories/User/Profile/ProfileRepository";
import { UpdateProfileRepository } from "@/repositories/User/Profile/UpdateProfileRepository";
import { UpdateProfileService } from "@/services/User/Profile/UpdateProfileService";

const profileRepository = new ProfileRepository();
const updateProfileRepository = new UpdateProfileRepository();
const updateProfileService = new UpdateProfileService(profileRepository, updateProfileRepository);

export async function PUT(request) {
    try {
        const { form } = await request.json()
        const result = await updateProfileService.execute(form);

        if (!result.status) {
            return NextResponse.json({ status: false, message: result.message });
        }

        (await cookies()).delete('token');

        return NextResponse.json({ status: true, update: result.update });
    } catch (error) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}