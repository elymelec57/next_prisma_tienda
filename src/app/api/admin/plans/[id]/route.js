import { NextResponse } from "next/server";
import { PlanRepository } from "@/repositories/admin/PlanRepository";
import { PlanService } from "@/services/admin/PlanService";
import { authorizeAdmin } from "@/libs/authAdmin";

const planRepository = new PlanRepository();
const planService = new PlanService(planRepository);

async function checkAdmin(request) {
  const admin = await authorizeAdmin(request);
  if (
    !admin ||
    !admin.authorized ||
    !admin.auth?.role ||
    admin.auth.role !== "Admin"
  ) {
    return false;
  }
  return true;
}

export async function PUT(request, { params }) {
  if (!(await checkAdmin(request))) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const data = await request.json();
    const plan = await planService.updatePlan(id, data);
    return NextResponse.json({ status: true, plan });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  if (!(await checkAdmin(request))) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await planService.deletePlan(id);
    return NextResponse.json({ status: true, message: "Plan eliminado" });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 }
    );
  }
}
