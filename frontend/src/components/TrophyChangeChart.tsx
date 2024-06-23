import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const TrophyChangeLineChart = ({
  trophyChanges,
}: {
  trophyChanges: number[];
}) => {
  const data = {
    labels: trophyChanges.map((_, index) => `${index + 1}`),
    datasets: [
      {
        label: "Trophy Changes",
        data: trophyChanges,
        fill: false,
        borderColor: "#F7A8FF",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: "Trophy Changes Over Matches",
        color: "white",
        font: {
          size: 24,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
          beginAtZero: false,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Color of the grid lines
          borderDash: [5, 5], // Dashed lines for the grid
          drawBorder: true,
          borderColor: "white", // Color of the axis line
          borderDash: [], // Solid lines for the axis
        },
      },
      y: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Color of the grid lines
          borderDash: [5, 5], // Dashed lines for the grid
          drawBorder: true,
          borderColor: "white", // Color of the axis line
          borderDash: [], // Solid lines for the axis
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default TrophyChangeLineChart;
