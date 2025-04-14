"use client";
import Image from "next/image";
import Navbar from "./ui/navbar/navbar";
import useWalletStore from "./store/walletStore";
import { useEffect, useState } from "react";
import InitializeForm from "./ui/initializeUser/initialize";
import DepositeForm from "./ui/deposit/deposite";
import AccountTable from "./ui/accountsTable/accounts";
import MarketOrder from "./ui/marketOrder/marketOrder";
import LimitOrder from "./ui/limitOrder/limitOrder";
import WithdrawlForm from "./ui/withdraw/withdraw";
import SearchAccount from "./ui/search/searchUser";
export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const isWalletConnected = useWalletStore((store) => store.isConnected);
  return (
    <div className="flex flex-col space-y-8">
      {isClient && <Navbar />}
      <h1 className="text-black">
        {isWalletConnected ? "Connected" : "Disconnected"}
      </h1>
      <SearchAccount />
      <InitializeForm />
      <DepositeForm />
      <WithdrawlForm />
      <AccountTable />
      <MarketOrder />
      <LimitOrder />
    </div>
  );
}
