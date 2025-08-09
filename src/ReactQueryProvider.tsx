"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient({
    defaultOptions: {
      queries:{
        staleTime:5*60*1000,
        refetchOnWindowFocus:false
      }
    },
  })
  interface providerProps {
    children : React.ReactNode
  }
  export const ReactQueryProvider =  ({children}:providerProps)=>{
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    )
  }