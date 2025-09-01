
import type { ChartOptions, DeepPartial } from "lightweight-charts";

const chartOptions = {
  width: 600,
  height: 300,
  autoSize: true,
  layout: {
    attributionLogo: false,
    fontFamily: "Roboto",
    background: {
      color: "transparent",
    },
    textColor: "#AEB9E1",
  },
  grid: {
    vertLines: {
      visible: false,
    },
    horzLines: {
      visible: false,
    },
  },
  crosshair: {
    vertLine: {
      style: 3,
      color: "#7E89AC",
    },
    horzLine: {
      style: 3,
      color: "#7E89AC",
    },
  },
} satisfies DeepPartial<ChartOptions>;


export { chartOptions }