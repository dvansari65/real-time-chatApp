import { createGroupInput } from "@/types/CreateGroup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NextResponse } from "next/server";



export const createGroup =  ({name,discription,GroupMembers,admins,userId,profileImage}:createGroupInput)=>{
    return useMutation({
        mutationKey:["newGroup"],
        mutationFn: async ()=>{
            const response = await fetch("/api/group",{
                method:"POST",
                credentials:"include",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    name,
                    discription,
                    GroupMembers,
                    admins,
                    userId,
                    profileImage
                })
            })
            const data = await response.json()
            if(!response.ok){
                return NextResponse.json(
                    {message:data?.message || "failed to create group!"},
                )
            }
            console.log("data",data);
            return data
        }
    })
}