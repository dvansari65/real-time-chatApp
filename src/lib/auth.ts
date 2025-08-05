
import { cookies } from "next/headers"
import { sessionPayload } from "../types/session"
import {jwtVerify, SignJWT} from "jose"
const secretKey = process.env.AUTH_SECRET
const key = new TextEncoder().encode(secretKey)


export const encrypt = async(payload:sessionPayload)=>{
    return await new SignJWT(payload)
        .setProtectedHeader({alg:"HS256"})
        .setExpirationTime("24h")
        .setIssuedAt()
        .sign(key)
}

export const decrypt = async(input:string):Promise<sessionPayload>=>{
    const {payload} = await jwtVerify(input,key ,{
        algorithms:['HS256']
    })
    return payload as sessionPayload
}

export const createSession = async (email:string,userId:string,role?:string)=>{
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({email,userId,role,expiresAt});
    
    const initializeCookies = await cookies()
    initializeCookies.set("session",session,{
        expires:expiresAt,
        sameSite:"lax",
        secure:process.env.NODE_ENV === 'production',
        httpOnly:true,
        path:"/"
    })
    return {
        success:true , session
    }
}

export const verifySession = async ()=>{
    const cookie = (await cookies()).get("session")?.value
    if(!cookie) return null;
    try {
        const session = await decrypt(cookie)
        
        if(!session || !session.expiresAt) return null;
        if(new Date(session.expiresAt) < new Date()){
            return null;
        }
        return session;
    } catch (error) {
        console.log("failed to verify session",error)
        return null
    }
}
export const deleteSession = async ()=>{
    (await cookies()).set("session","",{
        expires:new Date(0),
        sameSite:"lax",
        secure:process.env.NODE_ENV === 'production',
        httpOnly:true,
        path: '/',
    })
}