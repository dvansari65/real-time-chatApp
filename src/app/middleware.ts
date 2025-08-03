import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "../../lib/auth";


export const middleware = async (req:NextRequest)=>{
    const session = await verifySession()
    console.log("session from middleware",session)
    console.log("eq.url",req.url)
    if(!session || !session.expiresAt){
        return NextResponse.redirect(new URL("/login",req.url))
    }
    return NextResponse.next()
}
