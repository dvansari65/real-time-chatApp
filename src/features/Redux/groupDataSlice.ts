import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateProps {
    id:number | null;
}
const initialState:initialStateProps = {
    id:null
}

export const groupDataSlice = createSlice({
    name:"groupData",
    initialState,
    reducers:{
        setGroupId : (state,action:PayloadAction<number>)=>{
            state.id = action.payload
        }
    }
})

export const {setGroupId} = groupDataSlice.actions
export default groupDataSlice.reducer