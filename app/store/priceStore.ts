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
      const price = +p.price * 10 ** p.expo;
      set({ solPrice: price.toFixed(2) });
    }             
        }
    }
}));

export default solPriceStore;