import { createClient } from "@/app/utils/createClient";
import { BN, convertToBN, loadKeypair, OrderType, PositionDirection, Wallet } from "@drift-labs/sdk";
import { NextResponse } from "next/server";
import { date } from "zod";

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
 if (!process.env.NEXT_PUBLIC_KEY_PAIR) {
      throw new Error("Key pair not found.");
    }
    const wallet = new Wallet(loadKeypair(process.env.NEXT_PUBLIC_KEY_PAIR));

    if (!wallet) {
      console.log("Wallet not found");
      return;
    }
  try {
    const accountId = body.accountId;
    const driftClient = await createClient();
    if (!driftClient) {
      throw new Error("Failed to create client");
    }
   await driftClient?.subscribe();

    const user = driftClient.getUser(body.accountId, wallet.publicKey);
    console.log("Active id", driftClient.activeSubAccountId, user);
    const positionDirection =
      body.direction === "long"
        ? PositionDirection.LONG
        : PositionDirection.SHORT;
    const now = Math.floor(Date.now() / 1000);
    const maxTs = new BN(now + 100);
    const order = await driftClient.placePerpOrder(
      {
        orderType: OrderType.MARKET,
        marketIndex: 0,
        direction: positionDirection,
        baseAssetAmount: driftClient.convertToPerpPrecision(
          body.baseAssetAmount
        ),
        auctionStartPrice: driftClient.convertToPricePrecision(body.startPrice),
        auctionEndPrice: driftClient.convertToPricePrecision(body.endPrice),
        price: driftClient.convertToPricePrecision(body.price),
        auctionDuration: body.duration,
        maxTs,
      },
      undefined,
      body.accountId
    );
    console.log("Order", order);
    return NextResponse.json({
      message: "Order Successful.",
      activeId: driftClient.activeSubAccountId,
    });
  } catch (error) {
    console.log("Error market", error);
    return NextResponse.json({
      message: "Failed to Order.",
    });
  }
}
