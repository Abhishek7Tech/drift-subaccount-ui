import { ClientContext } from "@/app/providers/ClientProvider";
import { Button } from "@/components/ui/button";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  accountId: z.coerce.number().min(0, { message: "Invalid Account Id" }),
  direction: z.string(),
  baseAssetAmount: z.coerce
    .number()
    .min(0.1, { message: "Value should be > 1" }),
  price: z.coerce.number().min(1, { message: "Value should be > 1" }),
});

const LimitOrder = () => {
  const [tx, setTx] = useState<undefined | string>(undefined);
  const [message, setMessage] = useState<undefined | string>("Loading...");
  const [loading, setLoading] = useState<boolean>(true);

  const clientContext = useContext(ClientContext);
  if (!clientContext) {
    return;
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      direction: "long",
      accountId: 0,
      baseAssetAmount: 0.1,
      price: 1,
    },
  });
  useEffect(() => {
    if (clientContext?.subIds) {
      setMessage(undefined);
      setLoading(false);
    }
  }, [clientContext.subIds]);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const accountId = values.accountId;
    const direction = values.direction;
    const baseAssetAmount = values.baseAssetAmount;
    const price = values.price;
    setLoading(true);
    setMessage("Ordering....");
    try {
      const req = await fetch("api/order/limit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId,
          direction,
          baseAssetAmount,
          price,
        }),
      });
      const res = await req.json();
      console.log("Res", res);

      if (res?.txId) {
        setTx(res.txId);
        setMessage("Order Successfull.");
      }
    } catch (error) {
      console.log("Error", error);
      setLoading(false);
      setMessage("Order Failed");
    }
    setLoading(false);
    console.log("Values", values);
  }
  return (
    <>
      <Card className="space-y-8 min-w-96 mx-auto bg-gray-50 rounded-xl shadow-gray-500 p-4">
        <CardHeader>
          <CardTitle>Limit Order</CardTitle>
          <CardDescription>Make a limit order.</CardDescription>
        </CardHeader>
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="accountId"
                    render={({ field }) => (
                      <FormItem itemType="number" className="w-full">
                        <FormLabel>Select Sub Account</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value.toString()}
                            onValueChange={field.onChange}
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
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="direction"
                    render={({ field }) => (
                      <>
                        <FormItem>
                          <FormLabel htmlFor="direction">Position</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full" id="direction">
                                <SelectValue placeholder="LONG or SHORT" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="long">Long</SelectItem>
                                <SelectItem value="short">Short</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      </>
                    )}
                  />
                </div>

                <div className="flex flex-col space-y-1.5 w-full">
                  <FormField
                    control={form.control}
                    name="baseAssetAmount"
                    render={({ field }) => (
                      <>
                        <FormLabel htmlFor="baseAssetAmount">
                          SOL-PERP Amount
                        </FormLabel>
                        <FormItem>
                          <Input
                            type="number"
                            id="baseAssetAmount"
                            min={0.1}
                            step={0.1}
                            placeholder="100"
                            {...field}
                          />
                        </FormItem>
                      </>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5 w-full">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <>
                        <FormItem>
                          <FormLabel htmlFor="price">Price to Buy.</FormLabel>
                          <Input
                            type="number"
                            min={1}
                            step={0.001}
                            id="price"
                            placeholder="30.22"
                            {...field}
                          />
                        </FormItem>
                      </>
                    )}
                  />
                  {message && (
                    <span className="text-green-400 font-medium">
                      {message}
                    </span>
                  )}
                  <FormMessage />
                </div>

                <CardFooter className="flex px-0  space-y-1.5 justify-between">
                  <Button
                    disabled={loading}
                    type="submit"
                    className="cursor-pointer"
                  >
                    Order
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

export default LimitOrder;
