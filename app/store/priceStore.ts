import { Wallet, web3 } from "@coral-xyz/anchor";
import {PythSolanaReceiver} from "@pythnetwork/pyth-solana-receiver";
import { create } from "zustand";
import { HermesClient } from "@pythnetwork/hermes-client";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
const solPriceStore = create<{
    solPrice: string;
    fetchSolPrice: () => void;
}>((set, get) => ({
    solPrice: "",
    fetchSolPrice: async () => {
        const hermesClient = new HermesClient("https://hermes.pyth.network/", {});
        const priceData = await hermesClient.getLatestPriceUpdates(["0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d"])
        if(priceData.parsed?.length) {
            console.log(priceData.parsed[0]);
            const p = priceData.parsed[0].price;

    if (p.price !== undefined && p.expo !== undefined) {
      const price = +p.price * 10 ** p.expo; // adjust using exponent
      set({ solPrice: price.toFixed(2) });
    }             
        }
    }
}));

export default solPriceStore;

 
// The URL below is a public Hermes instance operated by the Pyth Data Association.
// Hermes is also available from several third-party providers listed here:
// https://docs.pyth.network/price-feeds/api-instances-and-providers/hermes
 
// Specify the price feed ID and the TWAP window in seconds (maximum 600 seconds)
 
// TWAP updates are strings of base64-encoded binary data