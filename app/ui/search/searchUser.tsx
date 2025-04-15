import { z, ZodSchema } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const pubKey = values.pubKey;
    console.log("PUBKEY", pubKey);
    const pubKeyToBN = new PublicKey(pubKey);
    if (!pubKeyToBN) {
      setErrorMsg("Invalid wallet address.");
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
      if (res?.accountInfo) {
        console.log("RES", res);
        setAccountInfo(res.accountInfo);
      }
    } catch (error) {
      console.log("Error", error);
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
                {errorMsg && (
                  <span className="text-red-500 font-medium">{errorMsg}</span>
                )}

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="cursor-pointer">
            Search
          </Button>
        </form>
      </Form>
      {accountInfo && <SearchAccountTable accountInfo={accountInfo} />}
    </div>
  );
};

export default SearchAccount;
