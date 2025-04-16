import { createClient } from "@/app/utils/createClient";
import createWallet from "@/app/utils/createWallet";
import {
  BN,
  convertToBN,
  loadKeypair,
  OrderType,
  PositionDirection,
  Wallet,
} from "@drift-labs/sdk";
import { NextResponse } from "next/server";
import { date } from "zod";

const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;
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

  if (!ENVIRONMENT) {
    throw new Error("Environment not found.");
  }
  const wallet = createWallet(ENVIRONMENT);

  if (!wallet) {
    throw new Error("Wallet not found.");
  }
  try {
    const accountId = body.accountId;
    const driftClient = await createClient();
    if (!driftClient) {
      throw new Error("Failed to create client");
    }

    await driftClient.subscribe();

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
      accountId
    );
    console.log("Order", order);
    return NextResponse.json(
      {
        message: "Order Successful.",
        txId: order,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error market", error);
    return NextResponse.json(
      {
        message: "Failed to Place Order.",
      },
      {
        status: 500,
      }
    );
  }
}
