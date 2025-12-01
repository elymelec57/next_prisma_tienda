import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching categories", error }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json();
    const newCategory = await prisma.category.create({
      data: { name },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating category", error }, { status: 500 });
  }
}