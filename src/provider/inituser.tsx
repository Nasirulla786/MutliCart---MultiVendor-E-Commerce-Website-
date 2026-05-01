"use client";
import { Provider } from "react-redux";
import useCurrentUser from "../app/hooks/useCurrentUser";
import useFetchAllVendor from "../app/hooks/useFetchAllVendor";
import { SessionProvider } from "next-auth/react";
import useGetAllProducts from "@/app/hooks/useAllProducts";
import useGetAllOrders from "@/app/hooks/useAllOrder";
// import { store } from "./redux/store";

export default function IniItUser({ children }: { children: React.ReactNode }) {
  useCurrentUser();
  useFetchAllVendor();
  useGetAllProducts();
  useGetAllOrders();
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
}
