import { getSingleGroupResponse } from "@/types/group";
import { useQuery } from "@tanstack/react-query"

export const useGetSingleGroup = (id:string)=>{
    return useQuery<getSingleGroupResponse>({
        queryKey:["singleGroup",id],
        queryFn:async ()=>{
            try {
                console.log("group id from api",id)
                if(!id){
                    throw new Error("Please provide group ID first!")
                }
                const response = await fetch(`/api/group/${id}`,{
                    method:"GET",
                    credentials:"include"
                })
                const data = await response.json();
                if(!response.ok){
                    throw new Error(data?.message || "failed to get group!")
                }
                return data;
            } catch (error) {
                
                throw error;
            }
        },
    })
}