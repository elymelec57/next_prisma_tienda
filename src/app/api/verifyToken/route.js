import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { isAuthorized } from "@/libs/auth";

export async function POST(request) {
    const { token, pathname } = await request.json()
    try {
        var decoded = jwt.verify(token, process.env.JWT_TOKEN);
    } catch (err) {
        return NextResponse.json({ status: false })
    }
    
    if (decoded) {
        const authorized = pathname ? isAuthorized(decoded.data.role, pathname) : true;
        return NextResponse.json({ status: true, auth: decoded.data, authorized })
    } else {
        return NextResponse.json({ status: false })
    }
}
