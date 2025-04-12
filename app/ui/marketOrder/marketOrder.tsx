"use client";
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
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import z from "zod";

const formSchema = z.object({
  accountId: z.coerce.number().min(0, { message: "Invalid Account Id" }),

  direction: z.string(),
  baseAssetAmount: z.coerce
    .number()
    .min(0.1, { message: "Value should be > 0.1" }),
  startPrice: z.coerce.number().min(0.1, { message: "Value should be > 0.1" }),
  endPrice: z.coerce.number().min(0.1, { message: "Value should be > 0.1" }),
  price: z.coerce.number().min(0.1, { message: "Value should be > 0.1" }),
  duration: z.coerce
    .number()
    .min(30, { message: "Minimum duration should be 30 seconds" }),
});

const MarketOrder = () => {
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
      startPrice: 0.1,
      endPrice: 0.1,
      price: 0.1,
      duration: 30,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Values", values);
    const accountId = values.accountId;
    const direction = values.direction;
    const baseAssetAmount = values.baseAssetAmount;
    const startPrice = values.startPrice;
    const endPrice = values.endPrice;
    const price = values.price;
    const duration = values.duration;

    try {
      const req = await fetch("/api/order/market", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId,
          direction,
          baseAssetAmount,
          startPrice,
          endPrice,
          price,
          duration,
        }),
      });
      const res = await req.json();
      console.log("Res", res);
    } catch (error) {
      console.log("Error", error);
    }
  }
  return (
    <Card className="space-y-8 min-w-96 mx-auto bg-gray-50 rounded-xl shadow-gray-500 p-4">
      <CardHeader>
        <CardTitle>Market Order</CardTitle>
        <CardDescription>Make a market order.</CardDescription>
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
                        Base Asset Amount
                      </FormLabel>
                      <FormItem>
                        <Input
                          type="number"
                          min={0.1}
                          id="baseAssetAmount"
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
                  name="startPrice"
                  render={({ field }) => (
                    <>
                      <FormItem>
                        <FormLabel htmlFor="startPrice">
                          Auction Start Price
                        </FormLabel>
                        <Input
                          type="number"
                          min={0.1}
                          id="startPrice"
                          placeholder="21.10"
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
                  name="endPrice"
                  render={({ field }) => (
                    <>
                      <FormItem>
                        <FormLabel htmlFor="endPrice">
                          Auction End Price
                        </FormLabel>
                        <Input
                          type="number"
                          min={0.1}
                          id="endPrice"
                          placeholder="21.20"
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
                          min={0.1}
                          id="price"
                          placeholder="30.22"
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
                  name="duration"
                  render={({ field }) => (
                    <>
                      <FormItem>
                        <FormLabel htmlFor="duration">
                          Auction Duration
                        </FormLabel>
                        <Input
                          type="number"
                          min={30}
                          step={1}
                          id="duration"
                          placeholder="30"
                          {...field}
                        />
                      </FormItem>
                    </>
                  )}
                />
              </div>

              <CardFooter className="flex px-0  space-y-1.5 justify-between">
                <Button type="submit" className="cursor-pointer">
                  Order
                </Button>
              </CardFooter>
            </div>
          </form>
        </Form>
      </>
    </Card>
  );
};

export default MarketOrder;
