import { partialUser } from "@/types/user"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface queryUserData {
    success?:boolean,
    user:partialUser | null
}

const initialState:queryUserData = {
    user:null
}

export const queryUserDataSlice = createSlice({
    name:"queryUserData",
    initialState,
    reducers:{
        setQueriedUserData :(state,action:PayloadAction<partialUser | null>)=>{
            state.user = action.payload
        }
    }
})

export const  {setQueriedUserData} = queryUserDataSlice.actions
export default queryUserDataSlice.reducer