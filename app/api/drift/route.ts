import { NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";

import {
  DriftClient,
  EventSubscriber,
  loadKeypair,
  Wallet,
} from "@drift-labs/sdk";
import SECRET_KEY from "@/keypair.json";
import { Keypair } from "@solana/web3.js";
import { createClient } from "@/app/utils/createClient";
const NETWORK =
  process.env.NEXT_PUBLIC_NETWORK_URL || "https://api.devnet.solana.com";

export async function GET() {
  try {
    const driftClient: DriftClient | undefined = await createClient();

    if (!driftClient) {
      throw new Error("Failed to create client");
    }
    await driftClient.subscribe();
    const subscription = driftClient.accountSubscriber.isSubscribed;

    return NextResponse.json({
      message: "Solana connection established",
      subscription,
    });
  } catch (error) {
    console.error("Error establishing connection:", error);
    return NextResponse.json(
      { error: "Failed to establish connection" },
      { status: 500 }
    );
  }
}
