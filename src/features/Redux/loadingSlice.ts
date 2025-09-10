import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface loadingForCreatingChatProps {
    isLoading:boolean,
    loadingForGroupChat:boolean
}

const initialState:loadingForCreatingChatProps = {
    isLoading:false,
    loadingForGroupChat:false
}


export const loadingSlice = createSlice({
    name:"Loading",
    initialState,
    reducers:{
        setLoading:(state,action:PayloadAction<boolean>)=>{
            state.isLoading = action.payload
        },
        setLoadingForGroupChat:(state,action:PayloadAction<boolean>)=>{
            state.loadingForGroupChat = action.payload
        }
    }
})

export const {setLoading,setLoadingForGroupChat} = loadingSlice.actions
export default loadingSlice.reducer