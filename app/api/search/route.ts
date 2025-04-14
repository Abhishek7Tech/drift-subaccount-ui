import {
  BulkAccountLoader,
  convertToNumber,
  DriftClient,
  loadKeypair,
  QUOTE_PRECISION,
  SpotMarkets,
  User,
  Wallet,
} from "@drift-labs/sdk";
import { PublicKey } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import { NextResponse } from "next/server";

const NETWORK =
  process.env.NEXT_PUBLIC_NETWORK_URL || "https://api.devnet.solana.com";

export async function POST(req: Request) {
  const body: { pubKey: string } = await req.json();
  const userAccountToRead = new PublicKey(body.pubKey);

  try {
    const connection = new Connection(NETWORK, "confirmed");
    console.log(
      `Solana ${connection.rpcEndpoint} connection established successfully`
    );
    if (!process.env.NEXT_PUBLIC_KEY_PAIR) {
      throw new Error("Key pair not found.");
    }
    const wallet = new Wallet(loadKeypair(process.env.NEXT_PUBLIC_KEY_PAIR));

    if (!wallet) {
      console.log("Wallet not found");
      return;
    }
    console.log("ADDRESS", wallet.publicKey.toString());
    const solOracleInfo = SpotMarkets["devnet"].find(
      (market) => market.marketIndex === 1
    )!;

    const bulkAccountLoader = new BulkAccountLoader(
      connection,
      "confirmed",
      500
    );

    const driftClient = new DriftClient({
      connection,
      accountSubscription: {
        type: "websocket", // Use polling with bulkAccountLoader
      },
      wallet,
      perpMarketIndexes: [0, 1],
      oracleInfos: [
        {
          publicKey: solOracleInfo.oracle,
          source: solOracleInfo.oracleSource,
        },
      ],
      env: "devnet",
    });

    await driftClient.subscribe();

    console.log("SUBSCRIBED", await driftClient.isSubscribed);

    const user: User = new User({
      driftClient,
      userAccountPublicKey: userAccountToRead,
      accountSubscription: {
        type: "websocket", // Use polling with bulkAccountLoader
      },
    });
    // console.log("USER", user.subscribe());
    // await user.subscribe();

    await user.subscribe();

    if (!user.isSubscribed) {
      console.log("USER NEVER FETCHED");
      return;
    }

    console.log(
      "User prototype methods:",
      Object.getOwnPropertyNames(Object.getPrototypeOf(user))
    );
    console.log(
      "ACC",
      await user.subscribe(),
      convertToNumber(user.getPerpPosition(0)?.quoteAssetAmount)
    );
    // console.log(
    //   "ACC",
    //   await convertToNumber(user.getUserAccount())
    // );
    // const netAccountBalanceBN = await user.getNetUsdValue();
    // const netAccountBalance = +convertToNumber(netAccountBalanceBN).toFixed(2);
    // console.log("Base asset", netAccountBalance);
    // const balance = await user
    // console.log("Balnance", balance);
    const address = await user.getUserAccountPublicKey();
    console.log("Address", address.toString());
    const openOrders = user.getOpenOrders();
    console.log("Open Orders", openOrders.length);
    const accountInfo = {
      publicAddress: address,
      //   baseAssetAmount,
      openOrders: openOrders.length,
    };
    return NextResponse.json({
      message: "User Account",
      accountInfo,
    });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({
      message: "Failed to Fetch Accounts.",
    });
  }
}
