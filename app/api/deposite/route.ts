import { createClient } from "@/app/utils/createClient";
import { loadKeypair, Wallet } from "@drift-labs/sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const amount = await req.json();
  if (!process.env.NEXT_PUBLIC_KEY_PAIR) {
    throw new Error("Key pair not found.");
  }

    const wallet = new Wallet(loadKeypair(process.env.NEXT_PUBLIC_KEY_PAIR));

  try {
    const driftClient = await createClient();

    if (!driftClient) {
      throw new Error("Failed to create client");
    }

    await driftClient.subscribe();

    const marketIndex = 1; //SOL
    const amountInBN = driftClient.convertToSpotPrecision(marketIndex, amount);

    const user = await driftClient.getUser();
    //  const associatedTokenAccount = await driftClient.getAssociatedTokenAccount(marketIndex);
  

    // console.log(
    //   "ASSOCIATE ACCOUNT",
    //   associatedTokenAccount.toString(),
    //   "PUB",
    //   user.userAccountPublicKey.toString()
    // );
    const tx = await driftClient.deposit(
      amountInBN,
      marketIndex,
      wallet.publicKey,
    )

    return NextResponse.json({
      message: "Deposite Successful",
        tx: tx,
    });
  } catch (error) {
    console.log("ERROR deposite", error);
    return NextResponse.json({
      message: "Failed to deposite",
    });
  }
}
