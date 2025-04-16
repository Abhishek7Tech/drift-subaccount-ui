import { Connection, Keypair } from "@solana/web3.js";

import { DriftClient, loadKeypair, Wallet } from "@drift-labs/sdk";
import createWallet from "./createWallet";
const NETWORK =
  process.env.NEXT_PUBLIC_NETWORK_URL || "https://api.devnet.solana.com";

const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;
export async function createClient() {
  try {
    const connection = new Connection(NETWORK, "confirmed");
    console.log(
      `Solana ${connection.rpcEndpoint} connection established successfully`
    );

    if (!ENVIRONMENT) {
      throw new Error("Environment not found.");
    }
    const wallet = createWallet(ENVIRONMENT);

    if (!wallet) {
      throw new Error("Wallet not found.")
      
    }
    const driftClient = new DriftClient({
      connection,
      wallet,
      env: "devnet",
    });

    return driftClient;
  } catch (error) {
    console.log("Error", error);
    throw new Error("Failed to create client");
  }
}
