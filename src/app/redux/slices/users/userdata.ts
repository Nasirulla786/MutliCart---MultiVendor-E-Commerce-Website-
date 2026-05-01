import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name:"user",
    initialState:{
        currentUser:null,
        allOrdersData:[]

    },
    reducers:{
        setCurrentUser :(state , action)=>{
            state.currentUser = action.payload;

        },
        setAllOrdersData:(state , action)=>{
            state.allOrdersData = action.payload

        }
    }
})

export const {setCurrentUser , setAllOrdersData} = userSlice.actions;
export default userSlice.reducer
