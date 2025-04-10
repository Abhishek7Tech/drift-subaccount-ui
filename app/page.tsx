"use client";
import Image from "next/image";
import Navbar from "./ui/navbar/navbar";
import useWalletStore from "./store/walletStore";
import { useEffect, useState } from "react";
import UserInfo from "./ui/initializeUser/initialize";
export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const isWalletConnected = useWalletStore((store) => store.isConnected);
  return (
    <div className="">
      {isClient && <Navbar />}
      <h1 className="text-black">
        {isWalletConnected ? "Connected" : "Disconnected"}
      </h1>
      <UserInfo />
    </div>
  );
}
