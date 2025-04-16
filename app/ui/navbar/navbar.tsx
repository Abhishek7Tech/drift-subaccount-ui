"use client";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";
import useWalletStore from "@/app/store/walletStore";

const Navbar = () => {
  const wallet = useWallet();

  const setConnection = useWalletStore((store) => store.setIsConnected);

  useEffect(() => {
    if (!wallet) {
      return;
    }
    setConnection(wallet.connected);
  }, [wallet]);
  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link href="/" className="text-white font-medium text-2xl">
        Drift
      </Link>

      <WalletMultiButton />
    </nav>
  );
};

export default Navbar;
