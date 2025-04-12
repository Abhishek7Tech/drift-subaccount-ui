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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import z from "zod";

const formSchema = z.object({
  direction: z.string(),
  baseAssetAmount: z.coerce
    .number()
    .min(0.1, { message: "Value should be > 0.1" }),
});

const MarketOrder = () => {
  return (
    <Card className="space-y-8 min-w-96 mx-auto bg-gray-50 rounded-xl shadow-gray-500 p-4">
      <CardHeader>
        <CardTitle>Market Order</CardTitle>
        <CardDescription>Make a market order.</CardDescription>
      </CardHeader>
      <>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="direction">Position</Label>
              <Select>
                <SelectTrigger className="w-full" id="direction">
                  <SelectValue placeholder="LONG or SHORT" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="long">Long</SelectItem>
                  <SelectItem value="short">Short</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="baseAssetAmount">Base Asset Amount</Label>
              <Input
                type="number"
                min={1}
                id="baseAssetAmount"
                placeholder="100"
              />
            </div>

            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="startPrice">Auction Start Price</Label>
              <Input
                type="number"
                min={1}
                id="startPrice"
                placeholder="21.10"
              />
            </div>

            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="endPrice">Auction End Price</Label>
              <Input type="number" min={1} id="endPrice" placeholder="21.20" />
            </div>

            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="price">Price to Buy.</Label>
              <Input type="number" min={1} id="price" placeholder="30.22" />
            </div>

            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="duration">Auction Duration</Label>
              <Input
                type="number"
                min={1}
                step={1}
                id="duration"
                placeholder="30"
              />
            </div>

            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="maxTs">Max. Timestamp</Label>
              <Input
                type="number"
                min={1}
                step={1}
                id="maxTs"
                placeholder="30"
              />
            </div>
          </div>
        </form>
      </>
      <CardFooter className="flex px-0 justify-between">
        <Button>Order</Button>
      </CardFooter>
    </Card>
  );
};

export default MarketOrder;
