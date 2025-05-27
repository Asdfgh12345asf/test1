const CHART_LAMBDA_URL = "YOUR_LAMBDA_URL";

let powerChart;

async function fetchPowerData() {
  try {
    const response = await fetch("/api/power-data");
    const data = await response.json();
    updateDashboard(data);
  } catch (error) {
    console.error("Error fetching power data:", error);
  }
}

function formatDateTime(dateString) {
  // Parse MongoDB ISO date string and format it
  try {
    const date = new Date(dateString.$date);
    return date.toLocaleString();
  } catch (e) {
    // Fallback if the date is not in MongoDB format
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (err) {
      return "N/A";
    }
  }
}

function updateDashboard(data) {
  // Update metrics
  document.getElementById("current-power").textContent =
    `${data.power_consumption.current} ${data.power_consumption.unit}`;
  document.getElementById("daily-total").textContent =
    `${data.power_consumption.daily_total?.toFixed(2) || "N/A"} kWh`;
  document.getElementById("peak-power").textContent =
    `${data.power_consumption.peak?.toFixed(2) || "N/A"} ${data.power_consumption.unit}`;
  document.getElementById("daily-cost").textContent =
    `$${data.statistics.daily_cost?.toFixed(2) || "N/A"}`;

  // Update status with proper date formatting
  const status = document.getElementById("status");
  const lastUpdated = new Date();
  status.textContent = `Last updated: ${lastUpdated}`;

  // Update chart
  updateChart(data.chart_data.hourly);

  // Add download button handler
  document.getElementById("downloadSvg").onclick = () => {
    downloadSvgChart(data.chart_data.hourly);
  };
}

function updateChart(chartData) {
  const ctx = document.getElementById("powerChart").getContext("2d");

  if (powerChart) {
    powerChart.destroy();
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false
        },
        ticks: {
          padding: 10
        }
      },
      x: {
        grid: {
          drawBorder: false
        },
        ticks: {
          padding: 10
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'start'
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    }
  };

  powerChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: `Power Consumption (${chartData.unit})`,
          data: chartData.values,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: chartOptions,
  });
}

// Update the downloadSvgChart function
async function downloadSvgChart(chartData) {
  try {
    const response = await fetch(`/api/chart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        labels: chartData.labels,
        values: chartData.values,
      }),
    });

    if (!response.ok) throw new Error("Failed to generate SVG");

    const svg = await response.text();

    // Create download link
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "power-chart.svg";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading SVG:", error);
    alert("Failed to download chart. Please try again.");
  }
}

// Fetch data initially and then every 30 seconds
fetchPowerData();
setInterval(fetchPowerData, 30000); 