import { Chart, ChartConfig, ChartData } from "./chart";

const data: ChartData[] = [
  {
    label: "1",
    value: 12,
  },
  {
    label: "2",
    value: 18,
  },
  {
    label: "3",
    value: 70,
  },
  {
    label: "4",
    value: 40,
  },
  {
    label: "5",
    value: 60,
  },
  {
    label: "6",
    value: 15,
  },
  {
    label: "7",
    value: 52,
  },
  {
    label: "8",
    value: 28,
  },
];
const config: ChartConfig = {
  labelTitle: "Tanggal",
  valueTitle: "Jumlah",
  data,
};
new Chart(document.querySelector("canvas")!, config);
