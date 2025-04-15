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


interface AccountInfo {
  publicAddress: string;
  ownerAddress: string;
  totalDeposits: number;
  totalWithdraws: number;
  openOrders: number;
}

const SearchAccountTable = ({
  accountInfo,
}: {
  accountInfo: AccountInfo[];
}) => {
  return (
    <>
      <Table className="space-y-8  mx-auto max-w-2xl bg-gray-50 rounded-xl shadow-sm shadow-gray-500 p-4">
        <TableCaption>Account Info</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">Sub Account Address</TableHead>
            <TableHead className="w-[100px] text-center">Account Address</TableHead>
            <TableHead className="w-[100px] text-center">Total Deposits</TableHead>
            <TableHead className="w-[100px] text-center">Total Withdraws</TableHead>
            <TableHead className="w-[100px] text-center">Open Orders</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accountInfo?.map((acc) => (
            <TableRow key={acc.publicAddress}>
              <TableCell className="font-medium">
                {acc.publicAddress.toString()}
              </TableCell>

              <TableCell className="font-medium">
                {acc.ownerAddress.toString()}
              </TableCell>

              <TableCell className="font-medium text-center">
                {"$" + acc.totalDeposits.toFixed(2)}
              </TableCell>

              <TableCell className="font-medium text-center">
                {"$" + acc.totalWithdraws.toFixed(2)}
              </TableCell>

              <TableCell className="font-medium text-center">{acc.openOrders}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default SearchAccountTable;
