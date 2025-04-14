import { createClient } from "@/app/utils/createClient";
import {
  loadKeypair,
  OrderType,
  PositionDirection,
  Wallet,
} from "@drift-labs/sdk";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body: {
    accountId: number;
    direction: "long" | "short";
    baseAssetAmount: number;
    price: number;
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
        ? await driftClient.placePerpOrder(
            orderTypeShort,
            undefined,
            body.accountId
          )
        : await driftClient.placePerpOrder(
            orderTypeLong,
            undefined,
            body.accountId
          );

    return NextResponse.json({
      message: "Order Successful.",
      txId: order,
    });
  } catch (error) {
    console.log("Order limit", error);
    return NextResponse.json({
      message: "Failed to Order.",
    });
  }
}
