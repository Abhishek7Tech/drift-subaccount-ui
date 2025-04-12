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
import { UserAccount } from "@drift-labs/sdk";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
interface SubAccounts {
  subAccountId: number;
  publicAddress: PublicKey;
  baseAssetAmount: any;
  balance: number;
  isShort: boolean;
  isLong: boolean;
  openOrders: number;
}
[];
const AccountTable = () => {
  const [subAccounts, setSubAccounts] = useState<undefined | SubAccounts[]>(
    undefined
  );
  const [message, setMessage] = useState<string | undefined>(undefined);
  useEffect(() => {
    const fetchAccountsData = async () => {
      try {
        const req = await fetch("/api/accounts");
        const res = await req.json();
        if (res?.subAccounts) {
          setSubAccounts(res.subAccounts);
          console.log("RES", res.subAccounts);
        }
      } catch (error) {}
    };

    fetchAccountsData();
  }, []);
  return (
    <>
      <Table className="space-y-8 mx-auto max-w-2xl bg-gray-50 rounded-xl shadow-gray-500 p-4">
        <TableCaption>SubAccounts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Address</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Perp Position</TableHead>
            <TableHead>Is Short</TableHead>
            <TableHead>Is Long</TableHead>
            <TableHead>Open Orders</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subAccounts?.map((acc) => (
            <TableRow key={acc.subAccountId}>
              <TableCell className="font-medium">{acc.publicAddress.toString()}</TableCell>
              <TableCell className="text-center">{"$" + acc.balance}</TableCell>
              <TableCell className="text-center">{acc.baseAssetAmount}</TableCell>
              <TableCell className="text-center">{acc.isShort || "False"}</TableCell>
              <TableCell className="text-center">{acc.isLong || "False"}</TableCell>
              <TableCell className="text-center">{acc.openOrders}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {message && <span className="text-red-500 font-medium">{message}</span>}
    </>
  );
};

export default AccountTable;
