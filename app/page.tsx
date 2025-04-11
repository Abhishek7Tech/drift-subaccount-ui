"use client";
import Image from "next/image";
import Navbar from "./ui/navbar/navbar";
import useWalletStore from "./store/walletStore";
import { useEffect, useState } from "react";
import InitializeForm from "./ui/initializeUser/initialize";
import DepositeForm from "./ui/deposit/deposite";
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
      <InitializeForm />
      <DepositeForm/>
    </div>
  );
}
