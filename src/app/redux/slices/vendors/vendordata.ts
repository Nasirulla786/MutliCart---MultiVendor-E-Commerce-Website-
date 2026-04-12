import { createSlice } from "@reduxjs/toolkit";


const vendorSlice = createSlice({
    name:"vendor",
    initialState:{
        allVendorsData :[]
    },
    reducers:{
        setAllVendorsData:(state , action)=>{
            state.allVendorsData = action.payload

        }

    }
})

export const {setAllVendorsData} = vendorSlice.actions;
export default vendorSlice.reducer
