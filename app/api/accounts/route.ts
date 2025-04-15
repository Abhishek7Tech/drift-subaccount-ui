import { createClient } from "@/app/utils/createClient";
import {
  BN,
  convertToNumber,
  loadKeypair,
  PositionDirection,
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

    const subAccounts = await Promise.all(
      getSubAccounts.map(async (acc) => {
        const subAccountId = acc.subAccountId;
        const user = driftClient.getUser(subAccountId);
        const address = await driftClient.getUserAccountPublicKey(subAccountId);
        const baseAssetAmount = convertToNumber(
          user.getPerpPosition(0)?.baseAssetAmount
        ); // FOR SOL
        const netAccountBalanceBN = user.getNetUsdValue();
        const netAccountBalance =
          +convertToNumber(netAccountBalanceBN).toFixed(2);

        const totalCollateral = convertToNumber(user.getTotalCollateral());
        const freeCollateral = convertToNumber(user.getFreeCollateral());

        const openOrders = acc.openOrders;

        return {
          subAccountId,
          publicAddress: address,
          baseAssetAmount,
          netAccountBalance,
          totalCollateral,
          freeCollateral,
          openOrders,
        };
      })
    );
    console.log("Sup account", subAccounts);
    return NextResponse.json({
      message: "User Accounts",
      subAccounts,
    });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json({
      message: "Failed to Fetch Accounts.",
    });
  }
}
