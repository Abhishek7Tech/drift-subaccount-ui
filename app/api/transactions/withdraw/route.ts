import { createClient } from "@/app/utils/createClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body: { amount: number; accountId: number } = await req.json();

  try {
    const driftClient = await createClient();
    if (!driftClient) {
      throw new Error("Failed to create client.");
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

    const tx = await driftClient.withdraw(
      amountToBN,
      marketIndex,
      associatedTokenAccount,
      undefined,
      body.accountId
    );

    return NextResponse.json({
      message: "Withdrawl Successfull",
      tx: tx,
    });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json({
        message: "Failed to deposite",
      });
  }
}
