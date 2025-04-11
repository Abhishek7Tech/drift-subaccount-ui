import { Connection } from "@solana/web3.js";

import { DriftClient, loadKeypair, Wallet } from "@drift-labs/sdk";
const NETWORK =
  process.env.NEXT_PUBLIC_NETWORK_URL || "https://api.devnet.solana.com";

export async function createClient() {
  try {
    const connection = new Connection(NETWORK, "confirmed");
    console.log(
      `Solana ${connection.rpcEndpoint} connection established successfully`
    );
    if (!process.env.NEXT_PUBLIC_KEY_PAIR) {
      throw new Error("Key pair not found.");
    }
    const wallet = new Wallet(loadKeypair(process.env.NEXT_PUBLIC_KEY_PAIR));

    if (!wallet) {
      console.log("Wallet not found");
      return;
    }
    console.log("ADDRESS",wallet.publicKey.toString());
    const driftClient = new DriftClient({
      connection,
      wallet,
      env: "devnet",
    });

    return driftClient;
  } catch (error) {
    throw new Error("Failed to create client");
  }
}
