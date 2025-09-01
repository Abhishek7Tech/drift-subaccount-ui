"use client";

import usePriceStore from "@/app/store/dataStore";
import { useLegendStore } from "@/app/store/legendStore";
import solPriceStore from "@/app/store/priceStore";
import { useLegend } from "@/app/utils/chartLegends";
import { chartOptions } from "@/app/utils/chartOptions";
import convertTimestampToDateString from "@/app/utils/timeStampToDate";
import { CandlestickData, Time, WhitespaceData } from "lightweight-charts";
import {
  AreaSeries,
  CandlestickSeries,
  Chart,
  TimeScale,
  TimeScaleFitContentTrigger,
} from "lightweight-charts-react-components";
import { useEffect, useState } from "react";

interface PriceData {
  prices: [number, number][];
}

const ChartContainer = ({ data }: { data: CandlestickData[] }) => {
  const [currentCandle, setCurrentCandle] = useState<CandlestickData | null>(null);
  useEffect(() => {
  solPriceStore.getState().solPrice;
   const timestamp = Date.now() // candle bucket
const price = +solPriceStore((store) => store.solPrice);

if(!price) return;
setCurrentCandle( {
        time: convertTimestampToDateString(timestamp), // lightweight-charts uses seconds
        open: price,
        high: price,
        low: price,
        close: price,
      });
  }, [solPriceStore((store) => store.solPrice)]);


  if (!data.length) {
    console.log("Returning", data);
    return <div>Loading...</div>;
  }
  

  const { legendVisible, setLegendVisible } = useLegendStore();
  const { ref, legendData, onCrosshairMove } = useLegend(legendVisible, data);
  const solPrice = solPriceStore((store) => store.fetchSolPrice);

  useEffect(() => {
    solPrice();
  },[])

  return (
    <div className="h-[480px] w-a pl-2">
      <h3 style={{color: "#AEB9E1"}}>SOL: ${solPriceStore((store) => store.solPrice)}</h3>
        {legendData !== null && legendVisible && (
      <div className="flex flex-row space-x-1">

        <h3 style={{color: "#AEB9E1"}}>0: <span style={{color: `${legendData.color}`}}>{legendData.open}</span></h3>
        <h3 style={{color: "#AEB9E1"}}>H: <span style={{color: `${legendData.color}`}}>{legendData.high}</span></h3>
        <h3 style={{color: "#AEB9E1"}}>L: <span style={{color: `${legendData.color}`}}>{legendData.low}</span></h3>
        <h3 style={{color: "#AEB9E1"}}>C: <span style={{color: `${legendData.color}`}}>{legendData.close}</span></h3>

      </div>
        )}
      <Chart
        options={chartOptions}
        onCrosshairMove={onCrosshairMove}
        containerProps={{
          style: { minWidth: 275, minHeight: 480 },
        }}
      >
        {/* <h1 className="bg-red">{legendData?.time}</h1> */}
        <CandlestickSeries
          ref={ref}
          data={data}
          options={{
            upColor: "#28a49c",
            downColor: "#ff6b6b",
            borderUpColor: "#28a49c",
            borderDownColor: "#ff6b6b",
            wickUpColor: "#28a49c",
            wickDownColor: "#ff6b6b",
          }}
        />
        <TimeScale>
          <TimeScaleFitContentTrigger deps={[]} />
        </TimeScale>
      </Chart>
    </div>
  );
};

export default ChartContainer;
