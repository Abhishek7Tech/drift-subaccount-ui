import { createClient } from "@/app/utils/createClient";
import { DriftClient } from "@drift-labs/sdk";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const driftClient: DriftClient | undefined = await createClient();
    if (!driftClient) {
      throw new Error("Failed to create client");
    }

    await driftClient.subscribe();
    const client = driftClient?.getUserAccount();
    const subAccountIds = await driftClient.getNextSubAccountId();
    let subAccounts = [];
    for (let i = 0; i < subAccountIds; i++) {
      console.log("Ids", i);
      subAccounts.push(i);
    }
    if (client) {
      return NextResponse.json({
        message: "Client exsist",
        userAccount: true,
        subAccountIds: { ids: subAccounts },
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: "User don't exsist",
      userAccount: false,
    });
  }
}
