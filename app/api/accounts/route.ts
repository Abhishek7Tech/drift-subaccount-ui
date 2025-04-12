import { createClient } from "@/app/utils/createClient";
import {
  BN,
  convertToNumber,
  loadKeypair,
  QUOTE_PRECISION,
  User,
  Wallet,
} from "@drift-labs/sdk";
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
   
    const wallet = new Wallet(loadKeypair(process.env.NEXT_PUBLIC_KEY_PAIR));

    const getSubAccounts = await driftClient.getUserAccountsForAuthority(
      wallet.publicKey
    );
    function calculateAccountValueUsd(user: User): number {
      const netSpotValue = convertToNumber(
        user.getNetSpotMarketValue(),
        QUOTE_PRECISION
      );
      const unrealizedPnl = convertToNumber(
        user.getUnrealizedPNL(false, 1, undefined),
        QUOTE_PRECISION
      );
      console.log("VALUE", netSpotValue + unrealizedPnl);
      return netSpotValue + unrealizedPnl;
    }


    const subAccounts = await Promise.all(
      getSubAccounts.map(async (acc) => {
        const subAccountId = acc.subAccountId;
        const user = await driftClient.getUser(subAccountId);
        const address = await driftClient.getUserAccountPublicKey(subAccountId);
        const balance = calculateAccountValueUsd(user);
        const baseAssetAmount = convertToNumber(
          user.getPerpPosition(1)?.baseAssetAmount
        ); // FOR SOL
        console.log("Base amount", convertToNumber(baseAssetAmount));
        const isShort = baseAssetAmount < 0;
        const isLong = baseAssetAmount > 0;
        const openOrders = acc.openOrders;

        return {
          subAccountId,
          publicAddress: address,
          baseAssetAmount,
          balance,
          isShort: isShort,
          isLong: isLong,
          openOrders
        };
      })
    );

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
