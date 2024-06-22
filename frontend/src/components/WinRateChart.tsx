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
        backgroundColor: ["#0088FE", "#FF8042"],
        hoverBackgroundColor: ["#005f9e", "#ff6f42"],
      },
    ],
  };

  const options = {
    // responsive: true,
    // plugins: {
    // legend: {
    //     position: 'top',
    // },
    // tooltip: {
    //     callbacks: {
    //     label: function (context: any) {
    //         const label = context.label || '';
    //         const value = context.raw || 0;
    //         return `${label}: ${value}%`;
    //     },
    //     },
    // },
    // },
  };

  // return the pie chart and options above
  return <Pie data={windata} options={options} />;
};

export default WinPieChart;
