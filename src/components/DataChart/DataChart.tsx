import { FC, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { DemographicDataPerYear } from "../../interface/interface";

interface Props {
  data: DemographicDataPerYear[] | undefined;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DataChart: FC<Props> = ({ data }) => {
  const [showDetailed, setShowDetailed] = useState(false);

  const toggleChart = () => {
    setShowDetailed(!showDetailed);
  };

  const labels = data && data.map((item) => item.Rok);
  const menData = data && data.map((item) => item.Mężczyzna);
  const womenData = data && data.map((item) => item.Kobieta);
  const totalData = data && data.map((item) => item.Liczba);

  const chartData = showDetailed
    ? {
        labels: labels,
        datasets: [
          {
            label: "Mężczyzna",
            data: menData,
            backgroundColor: "rgba(54, 162, 235, 0.5)", // Kolor słupków dla mężczyzn
          },
          {
            label: "Kobieta",
            data: womenData,
            backgroundColor: "rgba(255, 99, 132, 0.5)", // Kolor słupków dla kobiet
          },
        ],
      }
    : {
        labels: labels,
        datasets: [
          {
            label: "Suma (Mężczyzna + Kobieta)",
            data: totalData,
            backgroundColor: "rgba(75, 192, 192, 0.5)", // Kolor słupka dla sumy
          },
        ],
      };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: showDetailed
          ? "Podział na płeć per rok"
          : "Wszystkie urodzenia per rok",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Rok",
        },
      },
      y: {
        title: {
          display: true,
          text: "Liczba",
        },
      },
    },
  };
  return (
    <div>
      <button onClick={toggleChart}>
        {showDetailed ? "Całość" : "Podział na płeć"}
      </button>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default DataChart;
