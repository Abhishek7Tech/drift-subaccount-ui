import { createClient } from "@/app/utils/createClient";
import { loadKeypair, Wallet } from "@drift-labs/sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body: { amount: number; accountId: number } = await req.json();

  try {
    const driftClient = await createClient();

    if (!driftClient) {
      throw new Error("Failed to create client");
    }

    await driftClient.subscribe();

    const marketIndex = 1; //SOL
    const amountToBN = driftClient.convertToSpotPrecision(
      marketIndex,
      body.amount
    );

    const associatedTokenAccount = await driftClient.getAssociatedTokenAccount(
      marketIndex
    );

    const tx = await driftClient.deposit(
      amountToBN,
      marketIndex,
      associatedTokenAccount,
      body.accountId
    );
    console.log("ACC", tx);

    return NextResponse.json(
      {
        message: "Deposite Successfull",
        tx: tx,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("ERROR deposite", error);
    return NextResponse.json(
      {
        message: "Failed to deposite",
      },
      {
        status: 500,
      }
    );
  }
}
