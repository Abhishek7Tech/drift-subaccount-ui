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
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const navItems = useNavStore((store) => store.navItems);
  const clientContext = useContext(ClientContext);
  const wallet = useWallet();
  useEffect(() => {
    setIsClient(true);
  }, []);
  const activeNavItem = useNavStore((store) => store.activeNavItem);
  const isConnected = useWalletStore((store) => store.isConnected);
  const isConnectedHandler = useWalletStore((store) => store.setIsConnected);
  if (!clientContext) {
    return;
  }

  useEffect(() => {
    isConnectedHandler(wallet.connected);
  }, [wallet]);

  return (
    <>
      <div className="flex flex-col space-y-12 md:hidden items-center ">
        <h1 className="text-3xl text-center">Not available on smaller screens.</h1>
      </div>
      <div className="md:flex flex-col space-y-12 hidden ">
        {isClient && <Navbar />}

        <FeaturesBar navItems={navItems} />

        {isConnected && activeNavItem === "Initialize Account" && (
          <InitializeForm />
        )}
        {!clientContext.error && isConnected && (
          <div className="flex items-center flex-col justify-center">
            {activeNavItem === "Add SubAccount" && <CreateSubAccountsFrom />}
            {activeNavItem === "Search Account" && <SearchAccount />}
            {activeNavItem === "Deposite" && <DepositeForm />}
            {activeNavItem === "Withdraw" && <WithdrawlForm />}
            {activeNavItem === "My SubAccounts" && <AccountTable />}
            {activeNavItem === "Market Order" && <MarketOrder />}
            {activeNavItem === "Limit Order" && <LimitOrder />}
          </div>
        )}

        {!isConnected && (
          <ul className="mx-auto text-center font-semibold outline-dotted p-4 rounded-3xl">
            <li>Connect your wallet to continue.</li>
            <li>This application runs on Solana devnet.</li>
            <li>Supports SOL-PERP.</li>
            <li>
              Account subscription type: "Websockets" is used to search for sub
              accounts details.
            </li>
          </ul>
        )}

        {clientContext.error && (
          <span className="text-red-400 text-center font-medium">
            {clientContext.error}
          </span>
        )}
      </div>
    </>
  );
}
