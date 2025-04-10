"use client";
import { DriftClient } from "@drift-labs/sdk";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { createContext, ReactNode, useEffect, useState } from "react";
import initalizeClient from "../utils/initialize";
interface ClientInterface {
  driftClient: DriftClient | undefined;
}

export const ClientContext = createContext<ClientInterface | undefined>(
  undefined
);

const ClientProvider = ({ children }: { children: ReactNode }) => {
  const wallet = useWallet();
  const [client, setClient] = useState<DriftClient | undefined>(undefined);
  useEffect(() => {
    const setDriftClient = async () => {
      if (wallet?.publicKey) {
        const res: DriftClient | null = await initalizeClient(wallet);
        if (res) {
          setClient(res);
        }
      }
    };

    setDriftClient();
  }, []);

  const value = { driftClient: client };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};

export default ClientProvider;
