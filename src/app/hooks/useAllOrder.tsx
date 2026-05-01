'use client'
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setAllOrdersData } from "../redux/slices/users/userdata";



export default function useGetAllOrders(){
    const dispatch = useDispatch<AppDispatch>();
    useEffect(()=>{
        const fetchAllOrders= async()=>{
            try {
                const res = await axios.get('/api/order/get-all-orders');
                dispatch(setAllOrdersData(res.data.orders));

            } catch (error) {
                console.log(error);

            }
        }
        fetchAllOrders();

    },[])
}
