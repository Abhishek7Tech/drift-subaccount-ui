import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import SearchAccountTable from "../searchAccountTable/search";
import { NextResponse } from "next/server";

interface AccountInfo {
  publicAddress: string;
  ownerAddress: string;
  totalDeposits: number;
  totalWithdraws: number;
  openOrders: number;
}

const formSchema = z.object({
  pubKey: z.string(),
});

const SearchAccount = () => {
  const [errorMsg, setErrorMsg] = useState<undefined | string>(undefined);
  const [accountInfo, setAccountInfo] = useState<undefined | AccountInfo[]>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const pubKey = values.pubKey;
    setLoading(true);
    setErrorMsg(undefined);
    console.log("PUBKEY", pubKey);
    const pubKeyToBN = new PublicKey(pubKey);
    if (!pubKeyToBN) {
      setErrorMsg("Invalid wallet address.");
      setLoading(false);
      return;
    }

    try {
      const req = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pubKey }),
      });
      const res = await req.json();
      console.log("RES", res.ok);
      if (req.status === 200) {
        setAccountInfo(res.accountInfo);
        setErrorMsg(undefined);
      } else {
        setErrorMsg(res.message);
      }
      setLoading(false);
    } catch (error) {
      setErrorMsg("Something went wrong.");
      setLoading(false);
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pubKey: "",
    },
  });

  return (
    <div className="flex flex-col justify-center space-y-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="justify-around flex min-w-xl mx-auto bg-gray-50 rounded-xl border shadow-sm shadow-gray-500 p-4 items-end"
        >
          <FormField
            control={form.control}
            name="pubKey"
            render={({ field }) => (
              <FormItem className="w-2/3">
                <FormLabel>Enter a wallet address.</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter a wallet address."
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} type="submit" className="cursor-pointer">
            Search
          </Button>
        </form>
      </Form>
      {errorMsg && (
        <span className="text-red-500 font-medium text-center">{errorMsg}</span>
      )}
      {accountInfo && <SearchAccountTable accountInfo={accountInfo} />}
    </div>
  );
};

export default SearchAccount;
