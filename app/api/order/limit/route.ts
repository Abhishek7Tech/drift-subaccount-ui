import { createClient } from "@/app/utils/createClient";
import createWallet from "@/app/utils/createWallet";
import {
  loadKeypair,
  OrderType,
  PositionDirection,
  Wallet,
} from "@drift-labs/sdk";
import { error } from "console";
import { NextResponse } from "next/server";
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;
export async function POST(req: Request) {
  const body: {
    accountId: number;
    direction: "long" | "short";
    baseAssetAmount: number;
    price: number;
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
    console.log("BODY", body);

    const orderTypeShort = {
      orderType: OrderType.LIMIT,
      marketIndex: 0,
      direction: PositionDirection.SHORT,
      baseAssetAmount: driftClient.convertToPerpPrecision(body.baseAssetAmount),
      price: driftClient.convertToPricePrecision(body.price),
      oraclePriceOffset: driftClient.convertToPricePrecision(0.05).toNumber(),
    };

    const orderTypeLong = {
      orderType: OrderType.LIMIT,
      marketIndex: 0,
      direction: PositionDirection.LONG,
      baseAssetAmount: driftClient.convertToPerpPrecision(body.baseAssetAmount),
      price: driftClient.convertToPricePrecision(body.price),
    };

    const order =
      body.direction === "short"
        ? await driftClient.placePerpOrder(orderTypeShort, undefined, accountId)
        : await driftClient.placePerpOrder(orderTypeLong, undefined, accountId);

    return NextResponse.json(
      {
        message: "Order Successful.",
        txId: order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Order limit", error);
    return NextResponse.json(
      {
        message: "Failed to Order.",
      },
      { status: 500 }
    );
  }
}
