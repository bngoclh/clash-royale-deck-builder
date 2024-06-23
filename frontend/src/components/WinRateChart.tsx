// // src/components/PieChart.tsx
// import { VictoryPie } from 'victory';

// const PieChart = ({ winRate } : {winRate: number}) => {
//     const data = [
//         { x: "Win", y: winRate, label: `${winRate}%`},
//         { x: "Lose", y: 100 - winRate, label: `${100 - winRate}`}
//     ];

//     return (
//         <VictoryPie
//             data={data}
//             colorScale={["white", "yellow"]}
//             labels={({ datum }) => datum.label}
//         />
//     );
// };

// export default PieChart;

// src/components/CustomPieChart.tsx
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const WinPieChart = ({ winRate }: { winRate: string }) => {
  // Enlever le signe de pourcentage et convertir winRate en nombre
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
    maintainAspectRatio: false, // Add this to control the size of the chart
    plugins: {
      legend: {
        labels: {
          color: "white", // Change the color of the legend text
          font: {
            size: 18, // Increase the font size of the legend text
          },
        },
      },
    },
  };

  // return the pie chart and options above
  return <Pie data={windata} options={options} />;
};

export default WinPieChart;
