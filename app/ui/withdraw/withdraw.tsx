"use client";
import { ClientContext } from "@/app/providers/ClientProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  amount: z.coerce.number().min(0.1, {
    message: "Minimum 1 SOL required",
  }),
  accountId: z.coerce.number().min(0, { message: "Invalid Account Id" }),
});

const WithdrawlForm = () => {
  const [message, setMessage] = useState<undefined | string>("Loading...");
  const [tx, setTx] = useState<undefined | string>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

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
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const amount = Number(values.amount);
    const accountId = Number(values.accountId);
    setLoading(true);
    setMessage("Withdrawing....");
    console.log("Amount", amount, accountId);

    try {
      const req = await fetch("/api/transactions/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, accountId }),
      });

      const res = await req.json();

      if (res?.message) {
        setMessage(res.message);
      }

      if (res?.tx) {
        setTx(res.tx);
      }
    } catch (error) {
      setMessage("Something went Wrong.");
      setLoading(false);
    }
    setLoading(false);
  }

  return (
    <>
      <Card className="space-y-8 min-w-2xs mx-auto bg-gray-50 rounded-xl shadow-gray-500 p-4">
        <CardHeader>
          <CardTitle>Withdraw</CardTitle>
          <CardDescription>Make a withdrawl.</CardDescription>
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
                              min={0.1}
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
                    Withdraw SOL
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

export default WithdrawlForm;
