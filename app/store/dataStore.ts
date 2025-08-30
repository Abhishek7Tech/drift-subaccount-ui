import { create } from "zustand";

interface PriceData {
  prices: [number, number][];
}

const usePriceStore = create<{
  data: PriceData;
  fetch: () => Promise<void>;
}>((set, get) => ({
  data: {prices: []},
  fetch: async () => {
    const response = await fetch("/api/data");
    const data = await response.json();
    console.log("FETCHED DATA", data);
    set({ data: data });
  },
}));

export default usePriceStore;