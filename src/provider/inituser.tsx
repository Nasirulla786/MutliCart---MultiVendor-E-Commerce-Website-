'use client'
import { Provider } from "react-redux";
import useCurrentUser from "../app/hooks/useCurrentUser";
import useFetchAllVendor from "../app/hooks/useFetchAllVendor";
// import { store } from "./redux/store";

export default function IniItUser({ children }: { children: React.ReactNode }){
    useCurrentUser()
    useFetchAllVendor();
    return <>
    {/* <Provider store={store}> */}

    {children}
    {/* </Provider> */}
    </>;
}
