import { singleUserDataResponse } from "@/types/user"
import { useQuery } from "@tanstack/react-query"
import { NextResponse } from "next/server"
import { toast } from "sonner"



export const getSingleUser = (id:number)=>{
    return useQuery<singleUserDataResponse>({
        queryKey:["user",id],
        queryFn: async ()=>{
            const res = await fetch(`/api/users/${id}`,{
                method:"GET",
                credentials:"include"
            })
            const data = await res.json()
            if(!res.ok){
                toast.error(data.message || data.error || "failed to get user!")
                return;
            }
            if(data)return data;
        },
        staleTime:20*60*60
    })
}