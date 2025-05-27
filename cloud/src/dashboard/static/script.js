// Fetch power data from the API
async function fetchPowerData() {
    try {
        const response = await fetch('/api/power-data');
        const powerData = await response.json();
        return powerData;
    } catch (error) {
        console.error('Error fetching power data:', error);
        return null;
    }
}

// Create the chart
async function createChart() {
    const powerData = await fetchPowerData();
    if (!powerData) return;

    const ctx = document.getElementById('powerChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: powerData.labels,
            datasets: [{
                label: 'Power Usage (kW)',
                data: powerData.values,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '24-Hour Power Usage'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Power (kW)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                }
            }
        }
    });
}

// Update current values every 5 seconds (simulating real-time updates)
function updateValues() {
    const currentPower = (Math.random() * (3.5 - 1.5) + 1.5).toFixed(1);
    document.getElementById('currentPower').textContent = `${currentPower} kW`;
}

// Initialize the chart and start updates
createChart();
setInterval(updateValues, 5000);