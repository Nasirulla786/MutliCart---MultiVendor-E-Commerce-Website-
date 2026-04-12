'use client'
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setAllVendorsData } from "../redux/slices/vendors/vendordata";

export default function useFetchAllVendor() {
    const dispatch = useDispatch<AppDispatch>();
    try {
        useEffect(() => {
            const fetchVendors = async () => {
                try {
                    const res = await axios.get("/api/admin/all-vendor");
                    if (res) {
                        dispatch(setAllVendorsData(res.data));


                    }


                } catch (error) {
                    console.log("fetch all vendors error", error)


                }
            }
            fetchVendors();

        }, [])

    } catch (error) {
        console.log("fetch all vendors hook error", error);

    }
}
