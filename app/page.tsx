"use client";
import Image from "next/image";
import Navbar from "./ui/navbar/navbar";
import useWalletStore from "./store/walletStore";
import { useContext, useEffect, useState } from "react";
import InitializeForm from "./ui/initializeUser/initialize";
import DepositeForm from "./ui/deposit/deposite";
import AccountTable from "./ui/accountsTable/accounts";
import MarketOrder from "./ui/marketOrder/marketOrder";
import LimitOrder from "./ui/limitOrder/limitOrder";
import WithdrawlForm from "./ui/withdraw/withdraw";
import SearchAccount from "./ui/search/searchUser";
import { FeaturesBar } from "./ui/featuresbar/navbar";
import useNavStore from "./store/navStore";
import { ClientContext } from "./providers/ClientProvider";
import CreateSubAccountsFrom from "./ui/createSubAccounts/createSubAccount";
export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const navItems = useNavStore((store) => store.navItems);
  const clientContext = useContext(ClientContext);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const isWalletConnected = useWalletStore((store) => store.isConnected);
  const activeNavItem = useNavStore((store) => store.activeNavItem);
  if (!clientContext) {
    return;
  }
  return (
    <div className="flex flex-col space-y-8">
      {isClient && <Navbar />}
      <h1 className="text-black">
        {isWalletConnected ? "Connected" : "Disconnected"}
      </h1>
      <FeaturesBar navItems={navItems} />
      {activeNavItem === "Initialize Account" && <InitializeForm />}
      {!clientContext.error && (
        <div className="flex items-center justify-center">
          {activeNavItem === "Add SubAccount" && <CreateSubAccountsFrom />}
          {activeNavItem === "Search Account" && <SearchAccount />}
          {activeNavItem === "Deposite" && <DepositeForm />}
          {activeNavItem === "Withdraw" && <WithdrawlForm />}
          {activeNavItem === "My SubAccounts" && <AccountTable />}
          {activeNavItem === "Market Order" && <MarketOrder />}
          {activeNavItem === "Limit Order" && <LimitOrder />}
        </div>
      )}

      {clientContext.error && (
        <span className="text-red-400 text-center font-medium">
          {clientContext.error}
        </span>
      )}
    </div>
  );
}
