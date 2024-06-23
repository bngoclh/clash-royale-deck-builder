import { Pie, TooltipItem } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const WinPieChart = ({ winRate }: { winRate: string }) => {
  const winRateNumber = parseFloat(winRate.replace("%", ""));

  const windata = {
    labels: ["Win", "Lose"],
    datasets: [
      {
        label: "Win Rate",
        data: [winRateNumber, 100 - winRateNumber],
        backgroundColor: ["#720e9e", "#ffffff"],
        hoverBackgroundColor: ["#9b38d1", "#f2f2f2"],
        borderColor: "#dbd8e3",
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"pie">) {
            const labelIndex = context.dataIndex;
            const labelName = context.chart.data.labels![labelIndex];
            const value = context.chart.data.datasets![0].data![labelIndex];
            return `${
              labelName === "Lose" ? "Lose Rate" : "Win Rate"
            }: ${value}%`;
          },
        },
      },
      legend: {
        labels: {
          color: "white",
          font: {
            size: 18,
          },
        },
      },
    },
  };

  return <Pie data={windata} options={options} />;
};

export default WinPieChart;
