import { createClient } from "@/app/utils/createClient";
import { DriftClient } from "@drift-labs/sdk";
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
      return NextResponse.json(
        {
          message: "Account limit reached",
        },
        { status: 500 }
      );
    }
    const [txSig, userPublicKey] = await driftClient.initializeUserAccount(
      accountId,
      name
    );

    return NextResponse.json(
      {
        message: "Initialized SubAccount.",
        signature: txSig,
        address: userPublicKey,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json(
      { message: "Failed to create SubAccount." },
      { status: 500 }
    );
  }
}
