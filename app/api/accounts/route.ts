import { createClient } from "@/app/utils/createClient";
import createWallet from "@/app/utils/createWallet";
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
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;
export async function GET() {
  try {
    if (!ENVIRONMENT) {
      throw new Error("Environment not found.");
    }
    const driftClient = await createClient();
    if (!driftClient) {
      throw new Error("Failed to create client");
    }

    await driftClient.subscribe();
    const wallet = createWallet(ENVIRONMENT);

    if (!wallet) {
      throw new Error("Wallet not found.");
    }

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
    return NextResponse.json(
      {
        message: "User Accounts",
        subAccounts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Accounts.",
      },
      { status: 500 }
    );
  }
}
