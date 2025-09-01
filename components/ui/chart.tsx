"use client";

import { chartOptions } from "@/app/utils/chartOptions";
import { CandlestickData, Time, WhitespaceData } from "lightweight-charts";
import {
  AreaSeries,
  CandlestickSeries,
  Chart,
  TimeScale,
  TimeScaleFitContentTrigger,
} from "lightweight-charts-react-components";

interface PriceData {
  prices: [number, number][];
}

const ChartContainer = ({data}: {data: CandlestickData[]}) => {
  console.log("DATA", data);
  
  if(!data) {
    return;
  }

  console.log("DATA", data[0], data[0])

  return (
    <Chart options={chartOptions} containerProps={{ style: { flexGrow: "1" } }}>
      <CandlestickSeries
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
  );
};

export default ChartContainer;
