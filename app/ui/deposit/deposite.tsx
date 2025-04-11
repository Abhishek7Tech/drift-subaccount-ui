import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { number, z, ZodSchema } from "zod";
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
import { useState } from "react";
const formSchema = z.object({
  amount: z.coerce
    .number()
    .min(1, {
      message: "Minimum 1 SOL required",
    })
    .max(10, {
      message: "Maximim limit is 10 SOL",
    }),
});

const DepositeForm = () => {
  const [message, setMessage] = useState<undefined | string>(undefined);
  const [tx, setTx] = useState<undefined | string>(undefined);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const amount = Number(values.amount);
    console.log("Amount", amount);

    try {
      const req = await fetch("/api/deposite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(amount),
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
    }
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deposite</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    step={0.5}
                    placeholder="0.35"
                    {...field}
                  />
                </FormControl>
                {message && (
                  <span className="text-green-400 font-medium">{message}</span>
                )}

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="cursor-pointer">
            Deposite SOL
          </Button>
        </form>
      </Form>
      {tx && (
        <p className="text-slate-800 text-center break-all">Tx Id: {tx}</p>
      )}
    </>
  );
};

export default DepositeForm;
