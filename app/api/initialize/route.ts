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
   
    const [txSig, userPublicKey] = await driftClient.initializeUserAccount(
      0,
      name
    );

    return NextResponse.json(
      {
        message: "Initialized User.",
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
      { message: "Failed to initialize user." },
      { status: 500 }
    );
  }
}
