"use client";

import {
  AreaSeries,
  BarSeries,
  BaselineSeries,
  ColorType,
  createChart,
} from "lightweight-charts";
import { Layout } from "lucide-react";

const ChartContainer = () => {
  const container = document.getElementById("chart-container")!;
  const chartOptions = {
    layout: {
      textColor: "white",
      background: { type: ColorType.Solid, color: "#101828" },
    },
  };
  const chart = createChart(container, chartOptions);
  const areaSeries = chart.addSeries(AreaSeries);
  const barSeries = chart.addSeries(BarSeries);
  const baselineSeries = chart.addSeries(BaselineSeries);

  

  return (
    <div id="chart-container" style={{ width: "600px", height: "400px" }}></div>
  );
};

export default ChartContainer;
