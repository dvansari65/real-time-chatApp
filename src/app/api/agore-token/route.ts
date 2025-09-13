import { NextRequest, NextResponse } from "next/server";
import {RtcRole, RtcTokenBuilder} from "agora-access-token"


export const GET = async(req:NextRequest)=>{
    try {
        const searchParams = req.nextUrl.searchParams
        const channelName  = searchParams.get("channelName")
        const uid = searchParams.get("uid") || "0"
        if (!channelName) {
            return NextResponse.json({ error: "Channel name required" }, { status: 400 });
          }
        const appId = process.env.AGORA_APP_ID
        const agoraCertificate = process.env.AGORA_APP_CERTIFICAT
        const role = RtcRole.PUBLISHER
        const expireTime = 3600;
        const token = RtcTokenBuilder.buildTokenWithUid(
            String(appId),
            String(agoraCertificate),
            channelName,
            Number(uid),
            role,
            Math.floor(Date.now() / 1000) + expireTime
        )
        if(!token){
            return NextResponse.json(
                {
                    message:"Token not created!",
                    success:false
                },
                {status:500}
            )
        }
        return NextResponse.json(
            {
                message:"Token created successfully!",
                token,
                success:true
            },
            {status:200}
        )
    } catch (error:any) {
        console.log("failed to create token!",error.message)
        return NextResponse.json(
            {
                error:error.message
            },
            {status:500}
        )
    }
}