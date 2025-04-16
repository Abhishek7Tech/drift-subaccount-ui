import { NextResponse } from "next/server";


import {
  DriftClient,

} from "@drift-labs/sdk";

import { createClient } from "@/app/utils/createClient";

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
