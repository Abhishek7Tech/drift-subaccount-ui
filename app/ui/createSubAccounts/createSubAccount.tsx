"use client";

import { ClientContext } from "@/app/providers/ClientProvider";
import useWalletStore from "@/app/store/walletStore";
import { useWallet } from "@solana/wallet-adapter-react";
import { useContext, useEffect, useMemo, useState } from "react";
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
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const CreateSubAccountsFrom = () => {
  const [message, setMessage] = useState<undefined | string>(undefined);
  const [address, setAddress] = useState<undefined | string>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<undefined | string>(undefined);
  const clientContext = useContext(ClientContext);
  if (!clientContext) {
    return;
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userName = values.username;
    setLoading(true);
    setMessage("Initializing...");
    setError(undefined);
    try {
      const req = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userName),
      });
      const res = await req.json();
      if (req.status === 200) {
        setMessage(`${res.message}`);
        setAddress(res.address.toString());
        setError(undefined);
        clientContext?.setErrorHandler();
      } else {
        setError(res.message);
        setMessage(undefined);
      }
    } catch (error) {
      setError("Something went wrong.");
      setLoading(false);
    }
    setLoading(false);
  }
  return (
   
        <>
          <Form {...form}>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 min-w-2xs mx-auto bg-gray-50 rounded-xl border shadow-sm shadow-gray-500 p-4"
              >
              <CardHeader>
                <CardTitle>Sub Account</CardTitle>
                <CardDescription>Create a subaccount.</CardDescription>
              </CardHeader>
              <div className="space-y-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="drift" {...field} />
                    </FormControl>
                    {message && (
                      <span className="text-green-400 font-medium">
                        {message}
                      </span>
                    )}
                    {error && (
                      <span className="text-red-400 font-medium">{error}</span>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={loading}
                type="submit"
                className="cursor-pointer"
              >
                Add SubAccount
              </Button>
              </div>
            </form>
          </Form>
          {address && (
            <p className="text-slate-800 text-center break-all">
              Public address: {address}
            </p>
          )}
        </>   
  );
};

export default CreateSubAccountsFrom;
