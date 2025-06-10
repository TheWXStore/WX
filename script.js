const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const zip = '75028';
const units = 'imperial';

async function fetchWeather() {
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},US&units=${units}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?zip=${zip},US&units=${units}&appid=${apiKey}`;

  const [currentRes, forecastRes] = await Promise.all([
    fetch(currentUrl),
    fetch(forecastUrl)
  ]);

  const currentData = await currentRes.json();
  const forecastData = await forecastRes.json();

  displayCurrent(currentData);
  displayForecast(forecastData);
}

function displayCurrent(data) {
  const container = document.getElementById('current-weather');
  container.innerHTML = `
    <div class="weather-card">
      <p><strong>${data.name}</strong></p>
      <p>${data.weather[0].main}</p>
      <p>${Math.round(data.main.temp)}°F</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind: ${Math.round(data.wind.speed)} mph</p>
    </div>
  `;
}

function displayForecast(data) {
  const container = document.getElementById('forecast-weather');
  container.innerHTML = '';

  const daily = {};
  data.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!daily[date]) daily[date] = [];
    daily[date].push(item);
  });

  const days = Object.keys(daily).slice(1, 4); // Next 3 days
  days.forEach(date => {
    const dayData = daily[date];
    const temps = dayData.map(d => d.main.temp);
    const icon = dayData[0].weather[0].icon;
    const avgTemp = Math.round(temps.reduce((a, b) => a + b) / temps.length);

    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

    container.innerHTML += `
      <div class="weather-card">
        <p><strong>${dayName}</strong></p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon" />
        <p>${avgTemp}°F</p>
      </div>
    `;
  });
}

function updateTicker() {
  const ticker = document.getElementById('ticker');
  ticker.textContent = `Weather update for Flower Mound, TX — ${new Date().toLocaleTimeString()}`;
}

fetchWeather();
updateTicker();
setInterval(() => {
  fetchWeather();
  updateTicker();
}, 600000); // Update every 10 minutes
