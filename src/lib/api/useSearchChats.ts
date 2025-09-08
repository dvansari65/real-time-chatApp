import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"


export const useSearchUsers = (query:string)=>{
    return useQuery({
        queryKey:["searchChats",query],
        queryFn: async()=>{
            if(!query || query.trim() === ""){
                return []
            }
            console.log("Query in queryFn:", query);
            const params = new URLSearchParams({search:query})
            const response = await fetch(`/api/chat/search?${params.toString()}`)
            const data = await response.json()
            if(!response.ok){
                toast.error(data?.message || "Response  not obtained!")
                throw new Error(data?.message || "Response not obtained!")
            }
            console.log("data from search",data)
            return data;
        },
        enabled:!!query && query.trim().length > 0
    })
}