'use client'
import useCurrentUser from "./app/hooks/useCurrentUser";

export default function IniItUser({ children }: { children: React.ReactNode }){
    useCurrentUser()
    return <>{children}</>;
}
