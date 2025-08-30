import { userFromChat } from "@/types/chat"
import { Message, messageDataFromGetAllChatsResponse } from "@/types/message"
import { partialUser } from "@/types/user"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface initialStateData {
    messages:Message[] | undefined
    user:partialUser | null,
    chatId:number | null
}
const initialState:initialStateData = {
    messages:[],
    user:null,
    chatId:null
}

export const allChatDataSlice = createSlice({
    name:"allChatData",
    initialState,
    reducers:{
        storeMessages : (state,action:PayloadAction<Message[] >)=>{
            state.messages = action.payload
        },
        storeUser : (state,action:PayloadAction<partialUser>)=>{
            state.user = action.payload
        },
        setChatId : (state,action)=>{
            state.chatId = action.payload
        }
    }
})

export const {storeMessages,storeUser,setChatId} = allChatDataSlice.actions
export default allChatDataSlice.reducer

