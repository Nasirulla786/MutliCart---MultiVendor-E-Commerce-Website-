'use client'
import { setCurrentUser } from "@/app/redux/slices/users/userdata";
import { AppDispatch } from "@/app/redux/store";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useCurrentUser() {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get("/api/user/current-user");
                dispatch(setCurrentUser(res.data));


            } catch (error) {
                console.log("current user error", error);

            }
        }
        fetchCurrentUser();

    }, [])
}
