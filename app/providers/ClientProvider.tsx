"use client";
import { DriftClient } from "@drift-labs/sdk";
import {
  useAnchorWallet,
  useWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import { error } from "console";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";

interface ClientInterface {
  isSubscribed: boolean;
  error: null | string;
}

export const ClientContext = createContext<ClientInterface | undefined>(
  undefined
);

const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);
  useEffect(() => {
    const initializeClient = async () => {
      try {
        const req = await fetch("/api/drift");
        const res = await req.json();
        console.log("RES", res);
        setIsSubscribed(res.subscription);
      } catch (error) {
        setError("Something went wrong");
      }
    };
    initializeClient();
  });

  const value = { isSubscribed, error: null };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};

export default ClientProvider;
