import { getSingleGroupResponse } from "@/types/group";
import { useQuery } from "@tanstack/react-query"

export const useGetSingleGroup = (id:number)=>{
    return useQuery<getSingleGroupResponse>({
        queryKey:["singleGroup",id],
        queryFn:async ()=>{
            try {
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