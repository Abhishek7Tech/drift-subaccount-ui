import { Time, WhitespaceData } from "lightweight-charts";
import { create } from "zustand";
import type { CandlestickData } from "lightweight-charts";
import { format } from "path";
import convertTimestampToDateString from "../utils/timeStampToDate";
// interface PriceData {
//   prices: [CandlestickData<Time> | WhitespaceData<Time>][];
// }

const usePriceStore = create<{
  data: CandlestickData[];
  fetch: () => Promise<void>;
}>((set, get) => ({
  data: [],
  fetch: async () => {
    const response = await fetch("/api/data");
    const data: [number, number, number, number, number][] | undefined = await response.json();
    if (data) {
      // console.log("Raw Data:", data.map((item, idx) => console.log(item[0])));
      const formattedData = await data.map(([time, open, high, low, close], idx) => ({
        time: convertTimestampToDateString(time),
        open: open,
        high: high,
        low: low,
        close: close,
      }));
      console.log("Formatted Data:", formattedData);
      set({ data: formattedData });
    }
  },
}));

export default usePriceStore;



// const formattedDate = convertTimestampToDateString(1756711800000);
// console.log(formattedDate);
