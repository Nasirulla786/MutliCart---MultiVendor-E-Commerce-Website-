import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/users/userdata";
import vendorSlice from "./slices/vendors/vendordata"

export const store = configureStore({
    reducer:{
            "users":userSlice,
            "vendors":vendorSlice
    }
})



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
