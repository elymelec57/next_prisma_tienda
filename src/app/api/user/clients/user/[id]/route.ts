import { NextResponse } from "next/server";
import { ClientRepository } from "@/repositories/User/Client/ClientRepository";
import { ClientService } from "@/services/User/Client/ClientService";

const clientRepository = new ClientRepository();
const clientService = new ClientService(clientRepository);

export async function GET(request, segmentData) {
    try {
        const params = await segmentData.params;
        const restaurant = await clientService.getRestaurantWithClients(params.id);
        return NextResponse.json({ restaurant });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}