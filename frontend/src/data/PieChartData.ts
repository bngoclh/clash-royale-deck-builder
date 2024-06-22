export const windata = {
    labels: ['Win', 'Lose'],
    datasets: [
      {
        label: 'Win Rate',
        data: [winRate, 100 - winRate],
        backgroundColor: ['#0088FE', '#FF8042'],
        hoverBackgroundColor: ['#005f9e', '#ff6f42'],
      },
    ],
  };