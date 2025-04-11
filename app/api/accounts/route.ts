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

    
    const dep = subAccounts[0].totalDeposits;
    // const name = subAccounts[0].name.toString();
        //   const name = subAccounts[0].account.name.toString();
          console.log(
          "BAL",user.getUserAccountPublicKey().toString()
          );
        //   console.log("Name", name);

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
