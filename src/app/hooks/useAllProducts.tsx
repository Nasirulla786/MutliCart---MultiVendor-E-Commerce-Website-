'use client'
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setAllProductsData } from "../redux/slices/vendors/vendordata";


export default function useGetAllProducts(){
    const dispatch = useDispatch<AppDispatch>();
    useEffect(()=>{
        const fetchAllProducts = async()=>{
            try {
                const res = await axios.get('/api/vendor/getAllProducts');
                dispatch(setAllProductsData(res.data.products));

            } catch (error) {
                console.log(error);

            }
        }
        fetchAllProducts();

    },[])
}
