const chartInstances = [];

const hoverBarPlugin = {
  id: 'hoverBar',
  afterDraw(chart, args, options) {
    const { ctx, tooltip, chartArea } = chart;
    if (!tooltip._active || tooltip._active.length === 0) return;

    const active = tooltip._active[0];
    const x = active.element.x;
    const width = 30; // adjust this for wider/narrower bars
    const half = width / 2;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // light gray with low opacity
    ctx.fillRect(x - half, chartArea.top, width, chartArea.bottom - chartArea.top);
    ctx.restore();
  }
};


Chart.register(hoverBarPlugin);

function makeChart(id, data, color) {
  const ctx = document.getElementById(id).getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Dataset',
        data: data,
        borderColor: color,
        backgroundColor: color,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#000',
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: '#fff',
      }]
    },
    options: {
      responsive: false,
      animation: false,
      plugins: {
        tooltip: {
  enabled: true,
  backgroundColor: 'rgba(0,0,0,0)', // invisible tooltip
  titleColor: 'rgba(0,0,0,0)',
  bodyColor: 'rgba(0,0,0,0)',
  borderColor: 'rgba(0,0,0,0)',
  borderWidth: 0,
  displayColors: false
        },

        legend: { display: false }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      onHover: (event, elements) => {
        const chart = event.chart;
        if (elements.length > 0) {
          const index = elements[0].index;
          syncHover(index);
          updateDisplay(index);
        } else {
          clearHover();
        }
      }
    }
  });

  chartInstances.push(chart);
}

function syncHover(index) {
  chartInstances.forEach(chart => {
    chart.setActiveElements([{ datasetIndex: 0, index }]);
    // chart.tooltip.setActiveElements([{ datasetIndex: 0, index }], { x: 0, y: 0 });
    chart.update();
  });
}

function clearHover() {
  chartInstances.forEach(chart => {
    chart.setActiveElements([]);
    // chart.tooltip.setActiveElements([], { x: 0, y: 0 });
    chart.update();
  });
  document.getElementById('hover-info').textContent = 'Hover over a point';
}

function updateDisplay(index) {
  const label = labels[index];
  const values = chartInstances.map(chart => chart.data.datasets[0].data[index]);
  const text = `Month: ${label} | ` + values.map((val, i) => `Chart ${i + 1}: ${val}`).join(' | '); // Make the text Month: (jan etc...)| then make 4 different Chart (i): (x) and put ('|') inbetween them. 
  document.getElementById('hover-info').textContent = text; //replace the "hover over a point" text with the previously generated text
}

// Initialize all charts
datasets.forEach(({ id, data, color }) => {
  makeChart(id, data, color);
});

const bigChartContainer = document.getElementById('big-chart-container');
const gridContainer = document.getElementById('chart-grid');
const viewSelect = document.getElementById('view-select');
let bigChart = null;

viewSelect.addEventListener('change', () => {
  const mode = viewSelect.value;

  if (mode === 'grid') {
    bigChartContainer.style.display = 'none';
    gridContainer.style.display = 'grid';
  } else if (mode === 'big') {
    gridContainer.style.display = 'none';
    bigChartContainer.style.display = 'block';
    if (!bigChart) makeBigChart();
  }
});


function makeBigChart() {
  const ctx = document.getElementById('bigChart').getContext('2d');
  bigChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Combined',
        data: labels.map((_, i) =>
          datasets.reduce((sum, d) => sum + d.data[i], 0) / datasets.length
        ),
        borderColor: 'black',
        backgroundColor: 'black',
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#000',
        pointHoverBorderWidth: 2,
        pointHoverBorderColor: '#fff',
        hitRadius: 10,
      }]
    },
    options: {
      responsive: false,
      animation: false,
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0,0,0,0)',
          titleColor: 'rgba(0,0,0,0)',
          bodyColor: 'rgba(0,0,0,0)',
          displayColors: false
        },
        legend: { display: false }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      onHover: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          updateDisplay(index);
        } else {
          document.getElementById('hover-info').textContent = 'Hover over a point';
        }
      }
    },
   
  });
}
