import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface loadingForCreatingChatProps {
    isLoading:boolean
}

const initialState:loadingForCreatingChatProps = {
    isLoading:false
}


export const loadingSlice = createSlice({
    name:"Loading",
    initialState,
    reducers:{
        setLoading:(state,action:PayloadAction<boolean>)=>{
            state.isLoading = action.payload
        }
    }
})

export const {setLoading} = loadingSlice.actions
export default loadingSlice.reducer