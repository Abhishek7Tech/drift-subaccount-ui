import { createClient } from "@/app/utils/createClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const name = await req.json();
  console.log("BODY", name);
  try {
    const driftClient = await createClient();

    if (!driftClient) {
      throw new Error("Failed to create client");
    }
    await driftClient.subscribe();
    const accountId = await driftClient.getNextSubAccountId();

    if (accountId > 8) {
      return NextResponse.json({
        message: "Account limit reached",
      });
    }
    const [txSig, userPublicKey] = await driftClient.initializeUserAccount(
      accountId,
      name
    );

    return NextResponse.json({
      message: "Initialized User.",
      signature: txSig,
      address: userPublicKey,
    });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      { message: "Failed to initialize user." },
      { status: 500 }
    );
  }
}
