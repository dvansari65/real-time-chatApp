import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "../features/Redux/loadingSlice" 

export const store = configureStore({
    reducer:{
        Loading:loadingReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch