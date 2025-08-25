import { useQuery } from "@tanstack/react-query"

export const getGroupsInWhichUserIsPresent = ()=>{
    return useQuery({
        queryKey:["getGroups"],
        queryFn: async (id)=>{
            try {
                const response = await fetch("/api/group",{
                    method:"GET",
                    credentials:"include",
                    body:JSON.stringify(id)
                })
                const data = await response.json()
                if(!response.ok){
                    throw new Error(data?.message || "failed to get groups!")
                }
                return data
            } catch (error) {
                console.error("failed to get groups!",error)
                throw error
            }
        }
    })
}