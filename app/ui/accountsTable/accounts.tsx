"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProgramAccount } from "@coral-xyz/anchor";
import { BN, UserAccount } from "@drift-labs/sdk";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
interface SubAccounts {
  subAccountId: number;
  publicAddress: PublicKey;
  baseAssetAmount: any;
  netAccountBalance: number;
  totalCollateral: number;
  freeCollateral: number;
  openOrders: number;
}
[];
const AccountTable = () => {
  const [subAccounts, setSubAccounts] = useState<undefined | SubAccounts[]>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);
  useEffect(() => {
    const fetchAccountsData = async () => {
      try {
        const req = await fetch("/api/accounts");
        console.log("Fetching...");
        const res = await req.json();
        if (res?.subAccounts) {
          setSubAccounts(res.subAccounts);
          console.log("RES", res.subAccounts);
        }
      } catch (error) {
        console.log("Error", error);
        setError("Something went wrong.");
      }
    };

    fetchAccountsData();
  }, []);
  return (
    <>
      <Table className="space-y-8  mx-auto max-w-2xl bg-gray-50 rounded-xl shadow-sm shadow-gray-500 p-4">
        <TableCaption>SubAccounts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Address</TableHead>
            <TableHead>Total Balance</TableHead>
            <TableHead>Perp Position</TableHead>
            <TableHead>Total Collateral</TableHead>
            <TableHead>Free Collateral</TableHead>
            <TableHead>Open Orders</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subAccounts ? (
            subAccounts?.map((acc) => (
              <TableRow key={acc.subAccountId}>
                <TableCell className="font-medium text-center">
                  {acc.publicAddress.toString()}
                </TableCell>
                <TableCell className="text-center">
                  {"$" + acc.netAccountBalance}
                </TableCell>
                <TableCell className="text-center">
                  {acc.baseAssetAmount}
                </TableCell>
                <TableCell className="text-center">
                {"$" + acc.totalCollateral }
                </TableCell>
                <TableCell className="text-center">
                  {"$" + acc.freeCollateral}
                </TableCell>
                <TableCell className="text-center">{acc.openOrders}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-center text-green-400">
                Loading...
              </TableCell>
              <TableCell className="text-center text-green-400">
                Loading...
              </TableCell>
              <TableCell className="text-center text-green-400">
                Loading...
              </TableCell>
              <TableCell className="text-center text-green-400">
                Loading...
              </TableCell>
              <TableCell className="text-center text-green-400">
                Loading...
              </TableCell>
              <TableCell className="text-center text-green-400">
                Loading...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {error && <span className="text-red-500 font-medium">{error}</span>}
    </>
  );
};

export default AccountTable;
