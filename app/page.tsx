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
import { FeaturesBar } from "./ui/featuresbar/navbar";
import useNavStore from "./store/navStore";
export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const navItems = useNavStore((store) => store.navItems);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const isWalletConnected = useWalletStore((store) => store.isConnected);
  const activeNavItem = useNavStore((store) => store.activeNavItem);
  return (
    <div className="flex flex-col space-y-8">
      {isClient && <Navbar />}
      <h1 className="text-black">
        {isWalletConnected ? "Connected" : "Disconnected"}
      </h1>
      <FeaturesBar navItems={navItems} />
      {activeNavItem === "Search Account" && <SearchAccount />}
      {activeNavItem === "Initialize Account" && <InitializeForm />}
      {activeNavItem === "Deposite" && <DepositeForm />}
      {activeNavItem === "Withdraw" && <WithdrawlForm />}
      {activeNavItem === "My SubAccounts" && <AccountTable />}
      {activeNavItem === "Market Order" && <MarketOrder />}
      {activeNavItem === "Limit Order" && <LimitOrder />}
    </div>
  );
}
