"use client";
import { DriftClient } from "@drift-labs/sdk";
import {
  useAnchorWallet,
  useWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import { error } from "console";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { useStore } from "zustand";
import useClientStore from "../store/navStore";

interface ClientInterface {
  isSubscribed: boolean;
  error: null | string;
  setErrorHandler: () => void;
  subIds: undefined | number[];
}

export const ClientContext = createContext<ClientInterface | undefined>(
  undefined
);

const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subIds, setSubIds] = useState<undefined | number[]>(undefined);
  const [error, setError] = useState<null | string>(null);
  useEffect(() => {
    const initializeClient = async () => {
      try {
        const req = await fetch("/api/user");
        const res = await req.json();
        if (res.userAccount) {
          setIsSubscribed(res.userAccount);
          setSubIds(res.subAccountIds.ids);
         
          // clientStore.setSubIds();
        } else {
          setError("Account not initialized");
        }
      } catch (error) {
        setError("Something went wrong");
      }
    };
    initializeClient();
  }, []);

  const setErrorHandler = () => {
    setError(null);
  };
  const value = { isSubscribed, setErrorHandler, error, subIds };
  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};

export default ClientProvider;
