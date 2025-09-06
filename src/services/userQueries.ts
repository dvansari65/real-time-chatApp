
import {prisma} from "../lib/prisma"
export const updateUserStatus = async (userId:number)=>{
    try {
        const user = await prisma.user.update({
            where:{
                id:userId
            },
            data:{
                isOnline:true
            }
        })
        return user.isOnline
    } catch (error:any) {
        console.log("failed to update user status!",error.message)
        throw error;
    }
}