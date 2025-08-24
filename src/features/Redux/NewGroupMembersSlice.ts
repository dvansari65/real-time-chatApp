import {  createGroupInput } from "@/types/CreateGroup";
import { partialUser, User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



const initialState:createGroupInput = {
    userId:null,
    discription:"",
    name:"",
    GroupMembers:[],
    admins:[],
    profileImage:null
} 

export const groupSlice = createSlice({
    name:"NewGroup",
    initialState,
    reducers:{
        setGroupMembers : (state , action:PayloadAction<partialUser[]>)=>{
           state.GroupMembers = action.payload
        },
        removeUsers : (state,action:PayloadAction<number>)=>{
            state.GroupMembers?.filter(user => user.id !== action.payload)
        }
    }
})


export const {setGroupMembers,removeUsers} = groupSlice.actions
export default groupSlice.reducer