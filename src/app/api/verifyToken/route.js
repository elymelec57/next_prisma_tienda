import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request){
    const { token } = await request.json()
    let decoded = jwt.verify(token, process.env.JWT_TOKEN);
    if(decoded){
        return NextResponse.json({status: true, auth: decoded.data})
    }else{
        return NextResponse.json({status: false})
    }
}