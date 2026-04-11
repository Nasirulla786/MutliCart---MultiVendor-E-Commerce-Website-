'use client'
import axios from "axios";
import { useEffect } from "react";

export default function useCurrentUser() {
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get("/api/user/current-user");
                console.log("cuurentuser", res.data);

            } catch (error) {
                console.log("current user error", error);

            }
        }
        fetchCurrentUser();

    }, [])
}
