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
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const InitializeFrom = () => {
  const [message, setMessage] = useState<undefined | string>(undefined);
  const [address, setAddress] = useState<undefined | string>(undefined);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userName = values.username;
    try {
      const req = await fetch("/api/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userName),
      });
      const res = await req.json();
      if (res?.message) {
        setMessage(`${res.message}`);
        setAddress(res.address.toString());
      }
    } catch (error) {
      setMessage("Something went wrong.")
    }
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <>
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 min-w-2xs mx-auto bg-gray-50 rounded-xl shadow-gray-500 p-4"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="drift" {...field} />
              </FormControl>
              {message && <span className="text-green-400 font-medium">{message}</span>}

              <FormMessage />
            </FormItem>
          )}
          />
        <Button type="submit" className="cursor-pointer">
          Initialize Account
        </Button>
      </form>
    </Form>
          {address && <p className="text-slate-800 text-center break-all">Public address: {address}</p>}
    </>

  );
};

export default InitializeFrom;
