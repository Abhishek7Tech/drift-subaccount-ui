import { createClient } from "@/app/utils/createClient";
import { loadKeypair, Wallet } from "@drift-labs/sdk";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_KEY_PAIR) {
      throw new Error("Key pair not found.");
    }
    const driftClient = await createClient();
    if (!driftClient) {
      throw new Error("Failed to create client");
    }
    await driftClient.subscribe();
    const user = await driftClient.getUser();
    const wallet = new Wallet(loadKeypair(process.env.NEXT_PUBLIC_KEY_PAIR));

    const subAccounts = await driftClient.getUserAccountsForAuthority(
      wallet.publicKey
    );
    const accounts = await driftClient.getUserAccountPublicKey(1);
    console.log("Sub account", accounts.toString());
    return NextResponse.json({
      message: "User Accounts",
      subAccounts,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Failed to Fetch Accounts.",
    });
  }
}
