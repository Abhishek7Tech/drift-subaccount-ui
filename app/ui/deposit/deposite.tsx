"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useContext, useEffect, useMemo, useState } from "react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClientContext } from "@/app/providers/ClientProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const formSchema = z.object({
  amount: z.coerce.number().min(1, {
    message: "Minimum 1 SOL required",
  }),
  accountId: z.coerce.number().min(0, { message: "Invalid Account Id" }),
});

const DepositeForm = () => {
  const [message, setMessage] = useState<undefined | string>("Loading...");
  const [tx, setTx] = useState<undefined | string>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<undefined | string>(undefined);
  const clientContext = useContext(ClientContext);
  if (!clientContext) {
    return;
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      accountId: 0,
    },
  });

  useEffect(() => {
    if (clientContext?.subIds) {
      setMessage(undefined);
      console.log("SETTING..loading");
      setLoading(false);
    }
  }, [clientContext.subIds]);
  console.log(clientContext?.subIds);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const amount = Number(values.amount);
    const accountId = Number(values.accountId);
    setLoading(true);
    setMessage("Depositing....");
    setError(undefined);
  

    try {
      const req = await fetch("/api/transactions/deposite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, accountId }),
      });

      const res = await req.json();

      if (req?.status === 200) {
        setTx(res.tx);
        setError(undefined);
        setMessage(res.message);
      } else {
        setError(res.message);
        setMessage(undefined);
      }
    } catch (error) {
      setError("Something went Wrong.");
      setLoading(false);
    }
    setLoading(false);
  }

  return (
    <>
      <Card className="space-y-8 min-w-2xs mx-auto bg-gray-50 rounded-xl shadow-gray-500 p-4">
        <CardHeader>
          <CardTitle>Deposite</CardTitle>
          <CardDescription>Make a deposite.</CardDescription>
        </CardHeader>
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              // className=" mx-auto bg-gray-50 rounded-xl shadow-gray-500 border shadow-sm p-4"
            >
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <>
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              step={0.1}
                              placeholder="0.35"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      </>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem itemType="number" className="w-full">
                        <FormLabel>Select Sub Account</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            onValueChange={field.onChange}
                            value={field.value?.toString()}
                          >
                            <SelectTrigger className="w-full" id="accountId">
                              <SelectValue placeholder="0" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {clientContext &&
                                clientContext.subIds?.map((ids) => (
                                  <SelectItem key={ids} value={ids.toString()}>
                                    {ids.toString() || "0"}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {message && (
                          <span className="text-green-400 font-medium">
                            {message}
                          </span>
                        )}

                        {error && (
                          <span className="text-red-400 font-medium">
                            {error}
                          </span>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <CardFooter className="flex px-0  space-y-1.5 justify-between">
                  <Button
                    disabled={loading}
                    type="submit"
                    className="cursor-pointer"
                  >
                    Deposite SOL
                  </Button>
                </CardFooter>
              </div>
            </form>
          </Form>
        </>
      </Card>
      {tx && (
        <p className="text-slate-800 text-center break-all">Tx Id: {tx}</p>
      )}
    </>
  );
};

export default DepositeForm;
