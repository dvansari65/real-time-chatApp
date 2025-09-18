// generate agora token 

import { agoraTokenResponse } from "@/types/agora"
import { useQuery } from "@tanstack/react-query"


export const useGenerateToken = (channelName:string,uid:string)=>{
    return useQuery<agoraTokenResponse>({
        queryKey:["Agoratoken",channelName,uid],
        queryFn:async()=>{
            try {
                const response = await fetch(`/api/agora-token?channelName=${encodeURIComponent(channelName)}&uid=${encodeURIComponent(uid)}`,{
                    method:"GET",
                    credentials:"include"
                })
                const data = await response.json()
                console.log("error",data.message)
                if(!response.ok){
                    throw new Error(data.message || "something went wrong!")
                }
                return data;
            } catch (error:any) {
                console.log("failed to create token !",error.message)
                throw error
            }
        },
        enabled: !!(channelName && uid),
    })
}