"use client";
import Image from "next/image";
import Navbar from "./ui/navbar/navbar";
import useWalletStore from "./store/walletStore";
import { useEffect, useState } from "react";
export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const isWalletConnected = useWalletStore((store) => store.isConnected);
  return (
    <div className="">
      {isClient && <Navbar />}
      <h1 className="text-white">
        {isWalletConnected ? "Connected" : "Disconnected"}
      </h1>
    </div>
  );
}
