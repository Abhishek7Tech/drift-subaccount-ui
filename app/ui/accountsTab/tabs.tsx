"use client";

import { AppWindowIcon, CodeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InitializeFrom from "../initializeUser/initialize";
import CreateSubAccountsFrom from "../createSubAccounts/createSubAccount";
import DepositeForm from "../deposit/deposite";
import WithdrawlForm from "../withdraw/withdraw";
import MarketOrder from "../marketOrder/marketOrder";
import LimitOrder from "../limitOrder/limitOrder";

export function AccountsTab() {
  return (
    <Tabs defaultValue="marketOrders">
      <TabsList>
        <TabsTrigger value="initialize">Initialize Account</TabsTrigger>
        <TabsTrigger value="addSubAccount">Add SubAccount</TabsTrigger>
        <TabsTrigger value="deposite">Deposite</TabsTrigger>
        <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        <TabsTrigger value="marketOrders">Market Order</TabsTrigger>
        <TabsTrigger value="limitOrders">Limit Order</TabsTrigger>
      </TabsList>

      <TabsContent value="initialize">
        <InitializeFrom/>
      </TabsContent>

      <TabsContent value="addSubAccount">
         <CreateSubAccountsFrom/>
      </TabsContent>

      <TabsContent value="deposite">
        <DepositeForm/>
      </TabsContent>

      <TabsContent value="withdraw">
        <WithdrawlForm/>
      </TabsContent>

      <TabsContent value="marketOrders">
        <MarketOrder/>
      </TabsContent>

      <TabsContent value="limitOrders">
        <LimitOrder/>
      </TabsContent>
    </Tabs>
  );
}
