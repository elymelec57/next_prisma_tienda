import { NextResponse } from 'next/server';
import { SystemPaymentMethodRepository } from '@/repositories/admin/SystemPaymentMethod/SystemPaymentMethodRepository';
import { GetSystemPaymentMethodService } from '@/services/admin/SystemPaymentMethod/GetSystemPaymentMethodService';
import { UpdateSystemPaymentMethodService } from '@/services/admin/SystemPaymentMethod/UpdateSystemPaymentMethodService';
import { DeleteSystemPaymentMethodService } from '@/services/admin/SystemPaymentMethod/DeleteSystemPaymentMethodService';
import { authorizeAdmin } from '@/libs/authAdmin';

const repository = new SystemPaymentMethodRepository();

async function checkAdmin(request: any) {
    const admin: any = await authorizeAdmin(request);
    if (!admin || !admin.authorized || !admin.auth?.role || admin.auth.role !== 'Admin') {
        return false;
    }
    return true;
}

export async function GET(request: any, { params }: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const service = new GetSystemPaymentMethodService(repository);
        const paymentMethod = await service.execute(id);

        if (!paymentMethod) {
            return NextResponse.json({ status: false, message: "System payment method not found" }, { status: 404 });
        }

        return NextResponse.json({ status: true, data: paymentMethod });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(request: any, { params }: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        const data = await request.json();

        const getService = new GetSystemPaymentMethodService(repository);
        const existing = await getService.execute(id);

        if (!existing) {
            return NextResponse.json({ status: false, message: "System payment method not found" }, { status: 404 });
        }

        const updateService = new UpdateSystemPaymentMethodService(repository);
        const updated = await updateService.execute(id, {
            ...data,
            restaurantId: null
        });

        return NextResponse.json({ status: true, message: "Updated successfully", data: updated });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request: any, { params }: any) {
    if (!await checkAdmin(request)) {
        return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    try {
        const { id } = await params;

        const getService = new GetSystemPaymentMethodService(repository);
        const existing = await getService.execute(id);

        if (!existing) {
            return NextResponse.json({ status: false, message: "System payment method not found" }, { status: 404 });
        }

        const deleteService = new DeleteSystemPaymentMethodService(repository);
        await deleteService.execute(id);

        return NextResponse.json({ status: true, message: "Deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ status: false, message: error.message }, { status: 500 });
    }
}
