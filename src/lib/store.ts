import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "../features/Redux/loadingSlice" 
import NewGroupReducer from "../features/Redux/NewGroupMembersSlice"
import allChatDataReducer from "../features/Redux/allChatsSlice"
export const store = configureStore({
    reducer:{
        Loading:loadingReducer,
        NewGroup:NewGroupReducer,
        allChatData:allChatDataReducer
    }
    
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch