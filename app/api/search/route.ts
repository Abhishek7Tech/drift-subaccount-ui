import { createClient } from "@/app/utils/createClient";
import { convertToNumber } from "@drift-labs/sdk";
import { PublicKey } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import { NextResponse } from "next/server";

const NETWORK =
  process.env.NEXT_PUBLIC_NETWORK_URL || "https://api.devnet.solana.com";

export async function POST(req: Request) {
  const body: { pubKey: string } = await req.json();
  const ueserAccountToRead = new PublicKey(body.pubKey);
  try {
    const connection = new Connection(NETWORK, "confirmed");
    console.log(
      `Solana ${connection.rpcEndpoint} connection established successfully`
    );
    if (!process.env.NEXT_PUBLIC_KEY_PAIR) {
      throw new Error("Key pair not found.");
    }

    const driftClient = await createClient();

    if (!driftClient) {
      throw new Error("Failed to create client");
    }
    await driftClient.subscribe();
    // const baseAssetAmount = convertToNumber(
    //   user.getPerpPosition(0)?.baseAssetAmount
    // );

    // const address = await user.getUserAccountPublicKey();
    // console.log("Address", address.toString());
    // const openOrders = convertToNumber(user.getOpenOrders());
    // console.log("Open Orders", openOrders);
    // const accountInfo = { publicAddress: address, baseAssetAmount, openOrders };
    return NextResponse.json({
      message: "User Account",
    //   accountInfo,
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({
      message: "Failed to Fetch Accounts.",
    });
  }
}
