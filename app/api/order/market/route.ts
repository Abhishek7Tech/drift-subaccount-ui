import { createClient } from "@/app/utils/createClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body: {
    accountId: number;
    direction: "long" | "short";
    baseAssetAmount: number;
    startPrice: number;
    endPrice: number;
    price: number;
    duration: number;
  } = await req.json();

  try {
    const accountId = body.accountId;
    const driftClient = await createClient(accountId);
    if (!driftClient) {
      throw new Error("Failed to create client");
    }
    driftClient?.subscribe();
    console.log("Active id", driftClient.activeSubAccountId);
    
    return NextResponse.json({
        message: "Order Successful.",
        activeId: driftClient.activeSubAccountId
    })

  } catch (error) {
    console.log("Error market", error);
    return NextResponse.json({
        message: "Failed to Order."
    })
  }
}
