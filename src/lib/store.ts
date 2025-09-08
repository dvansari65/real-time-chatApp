import { combineReducers, configureStore } from "@reduxjs/toolkit";
import loadingReducer from "../features/Redux/loadingSlice";
import NewGroupReducer from "../features/Redux/NewGroupMembersSlice";
import allChatDataReducer from "../features/Redux/allChatsSlice";
import queriedUserDataReducer from "../features/Redux/searchedUserSlice";
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { persistStore } from "redux-persist";
import groupDataReducer from "@/features/Redux/groupDataSlice";
export const rootReducer = combineReducers({
  Loading: loadingReducer,
  NewGroup: NewGroupReducer,
  allChatData: allChatDataReducer,
  queriedData: queriedUserDataReducer,
  groupData:groupDataReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["queriedData", "allChatData"],
};
const persistedReducer = persistReducer(persistConfig,rootReducer);
export const store = configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:{
                ignoredActions:[FLUSH,REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
})
export const persister = persistStore(store)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
