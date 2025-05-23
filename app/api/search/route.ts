import createWallet from "@/app/utils/createWallet";
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
const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;
export async function POST(req: Request) {
  const body: { pubKey: string } = await req.json();
  const userAccountToRead = new PublicKey(body.pubKey);
  if (!userAccountToRead) {
    throw new Error("Invalid wallet address.");
  }

  try {
    const connection = new Connection(NETWORK, "confirmed");
    console.log(
      `Solana ${connection.rpcEndpoint} connection established successfully`
    );
    if (!ENVIRONMENT) {
      throw new Error("Environment not found.");
    }
    const wallet = createWallet(ENVIRONMENT);

    if (!wallet) {
      throw new Error("Wallet not found.");
    }
    console.log("ADDRESS", wallet.publicKey.toString());
    const solOracleInfo = SpotMarkets["devnet"].find(
      (market) => market.marketIndex === 1
    )!;

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

    await user.subscribe();

    if (!user.isSubscribed) {
      throw new Error("Failed to fetch account.");
    }

    console.log("ACC");
    const userAccount = await user.getUserAccount();
    const openOrders = convertToNumber(user.getPerpPosition(0)?.openOrders);
    const address = user.userAccountPublicKey.toString();
    const totalDeposits = convertToNumber(userAccount.totalDeposits);
    const totalWithdraws = convertToNumber(userAccount.totalWithdraws);
    const ownerAddress = userAccount.authority.toString();

    const accountInfo = [
      {
        publicAddress: address,
        ownerAddress,
        totalDeposits,
        totalWithdraws,
        openOrders,
      },
    ];
    return NextResponse.json(
      {
        message: "User Account",
        accountInfo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      {
        message: "Failed to Fetch Accounts.",
      },
      { status: 500 }
    );
  }
}
