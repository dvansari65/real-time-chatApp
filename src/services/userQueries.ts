
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
        console.log("isonline from backedn",user?.isOnline)
        return user.isOnline
    } catch (error:any) {
        console.log("failed to update user status!",error.message)
        throw error;
    }
}

export const joinedChatTime = async (id:number)=>{
    try {
        const updatedLeftAt = await prisma.chatMember.update({
            where:{
                id
            },
            data:{
                leftAt:new Date()
            }
        })
        return updatedLeftAt.leftAt
    } catch (error) {
        console.log("failed to updated left at status!",error)
        throw error;
    }
}