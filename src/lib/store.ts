import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "../features/Redux/loadingSlice" 
import NewGroupReducer from "../features/Redux/NewGroupMembersSlice"
export const store = configureStore({
    reducer:{
        Loading:loadingReducer,
        NewGroup:NewGroupReducer
    }
    
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch