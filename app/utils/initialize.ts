"use server";
import {
  AnchorWallet,
  useAnchorWallet,
  WalletContextState,
} from "@solana/wallet-adapter-react";
import { Connection, Transaction, VersionedTransaction } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { DriftClient, IWallet, Wallet } from "@drift-labs/sdk";
import { Keypair } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
const NETWORK =
  process.env.NEXT_PUBLIC_NETWORK_URL || "https://api.devnet.solana.com";

async function initalizeClient(wallet: WalletContextState | AnchorWallet) {
  const connection = new Connection(NETWORK, "confirmed");

  if (
    !wallet?.publicKey ||
    !wallet.signTransaction ||
    !wallet.signAllTransactions
  ) {
    console.log("WALLET KEY NOT FOUND");
    return null;
  }
  const driftClient = new DriftClient({
    connection,
    wallet: {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
    },
    env: "devnet",
  });

  await driftClient.subscribe();
  console.log("Subscribed");
  return driftClient;
}

export default initalizeClient;
