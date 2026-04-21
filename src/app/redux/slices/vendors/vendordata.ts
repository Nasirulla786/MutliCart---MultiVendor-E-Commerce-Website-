import { createSlice } from "@reduxjs/toolkit";


const vendorSlice = createSlice({
    name:"vendor",
    initialState:{
        allVendorsData :[],
        allProductsData:[],
    },
    reducers:{
        setAllVendorsData:(state , action)=>{
            state.allVendorsData = action.payload

        }
        ,
        setAllProductsData:(state, action)=>{
            state.allProductsData  = action.payload
        }

    }
})

export const {setAllVendorsData , setAllProductsData} = vendorSlice.actions;
export default vendorSlice.reducer
