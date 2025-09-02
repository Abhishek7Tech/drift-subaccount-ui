"use client";

import { useLegendStore } from "@/app/store/legendStore";
import solPriceStore from "@/app/store/priceStore";
import { useLegend } from "@/app/utils/chartLegends";
import { chartOptions } from "@/app/utils/chartOptions";
import convertTimestampToDateString from "@/app/utils/timeStampToDate";
import { CandlestickData } from "lightweight-charts";
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
  const [currentCandle, setCurrentCandle] = useState<CandlestickData | null>(
    null
  );
  const solPrice = solPriceStore((store) => store.fetchSolPrice);
  useEffect(() => {
    solPrice();
    const interval = setInterval(() => solPrice, 10000);
    return () => clearInterval(interval);
  }, []);

  const price = +solPriceStore((store) => store.solPrice);
  const { legendVisible } = useLegendStore();
  const { ref, legendData, onCrosshairMove } = useLegend(legendVisible, data);

  useEffect(() => {
    solPriceStore.getState().solPrice;
    const timestamp = Date.now();

    if (!price) return;
    setCurrentCandle({
      time: convertTimestampToDateString(timestamp),
      open: price,
      high: price,
      low: price,
      close: price,
    });
  }, [price]);

  return (
    <div className="w-1/2 pl-2">
      <h3 style={{ color: "#AEB9E1" }}>
        SOL: ${solPriceStore((store) => store.solPrice)}
      </h3>
      {legendData !== null && legendVisible && (
        <div className="flex flex-row space-x-1">
          <h3 style={{ color: "#AEB9E1" }}>
            0:{" "}
            <span style={{ color: `${legendData.color}` }}>
              {legendData.open}
            </span>
          </h3>
          <h3 style={{ color: "#AEB9E1" }}>
            H:{" "}
            <span style={{ color: `${legendData.color}` }}>
              {legendData.high}
            </span>
          </h3>
          <h3 style={{ color: "#AEB9E1" }}>
            L:{" "}
            <span style={{ color: `${legendData.color}` }}>
              {legendData.low}
            </span>
          </h3>
          <h3 style={{ color: "#AEB9E1" }}>
            C:{" "}
            <span style={{ color: `${legendData.color}` }}>
              {legendData.close}
            </span>
          </h3>
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
