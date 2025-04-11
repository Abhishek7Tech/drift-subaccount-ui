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
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
const AccountTable = () => {
  const [subAccounts, setSubAccounts] = useState<
    undefined | UserAccount[]
  >(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);
  useEffect(() => {
    const fetchAccountsData = async () => {
      try {
        const req = await fetch("/api/accounts");
        const res = await req.json();
        if (res?.subAccounts) {
          console.log("RES", res);
          const acc = res.subAccounts;
          
          setSubAccounts(res.subAccounts);
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
            <TableHead>Perp Positions</TableHead>
            <TableHead className="text-right">Open Orders</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      {message && <span className="text-red-500 font-medium">{message}</span>}
    </>
  );
};

export default AccountTable;
