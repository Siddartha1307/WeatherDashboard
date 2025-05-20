let useFahrenheit = true;

function toggleUnit() {
  useFahrenheit = !useFahrenheit;
  const city = document.getElementById('cityInput').value;
  if (city) getWeather();
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

function getWeather() {
  const city = document.getElementById('cityInput').value;
  const unit = useFahrenheit ? 'imperial' : 'metric';
  const apiKey = 'a35b8a1f9259ae64215f7a85743aa129'; // Replace with your real key

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      displayWeather(data);
      drawChart(data);
    })
    .catch(() => {
      document.getElementById('weatherResult').innerHTML = "<p style='color:red;'>City not found</p>";
    });
}

function getLocationWeather() {
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const unit = useFahrenheit ? 'imperial' : 'metric';
    const apiKey = 'a35b8a1f9259ae64215f7a85743aa129';

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        displayWeather(data);
        drawChart(data);
      });
  });
}

function displayWeather(data) {
  const weatherResult = document.getElementById('weatherResult');
  let output = `<h2>${data.city.name}, ${data.city.country}</h2>`;
  for (let i = 0; i < 5; i++) {
    const item = data.list[i * 8];
    const tempF = item.main.temp.toFixed(1);
    const tempC = ((item.main.temp - 32) * 5 / 9).toFixed(1);
    const displayTemp = useFahrenheit
      ? `${tempF} °F (${tempC} °C)`
      : `${tempC} °C (${tempF} °F)`;

    output += `
      <div class="card">
        <strong>${new Date(item.dt_txt).toDateString()}</strong><br/>
        Temp: ${displayTemp}<br/>
        Weather: ${item.weather[0].description}<br/>
        Humidity: ${item.main.humidity}%
      </div>
    `;
  }
  weatherResult.innerHTML = output;
}

function drawChart(data) {
  const labels = [];
  const temps = [];

  for (let i = 0; i < 5; i++) {
    const item = data.list[i * 8];
    const label = new Date(item.dt_txt).toDateString();
    const temp = item.main.temp.toFixed(1);
    temps.push(parseFloat(temp));
    labels.push(label);
  }

  const ctx = document.getElementById('weatherChart').getContext('2d');
  if (window.myChart) window.myChart.destroy(); // Clear previous
  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `Temperature (${useFahrenheit ? '°F' : '°C'})`,
        data: temps,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}
