const apiKey = '6e2251b9f3c14ced1743f59abe21de0f';

const input          = document.getElementById('cityInput');
const searchBtn      = document.getElementById('searchBtn');
const weatherBox     = document.getElementById('weatherBox');
const weatherDetails = document.getElementById('weatherDetails');
const notFound       = document.getElementById('notFound');
const locationRow    = document.getElementById('locationRow');
const divider        = document.getElementById('divider');

const weatherImgMap = {
  Clear:        'https://openweathermap.org/img/wn/01d@2x.png',
  Clouds:       'https://openweathermap.org/img/wn/03d@2x.png',
  Rain:         'https://openweathermap.org/img/wn/10d@2x.png',
  Drizzle:      'https://openweathermap.org/img/wn/09d@2x.png',
  Thunderstorm: 'https://openweathermap.org/img/wn/11d@2x.png',
  Snow:         'https://openweathermap.org/img/wn/13d@2x.png',
  Mist:         'https://openweathermap.org/img/wn/50d@2x.png',
};

// Live clock
function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: 'long', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit'
  };
  document.getElementById('dateTime').textContent =
    now.toLocaleDateString('en-US', options);
}
updateDateTime();
setInterval(updateDateTime, 60000);

function hideAll() {
  [weatherBox, weatherDetails, notFound].forEach(el => {
    el.classList.remove('fadeIn');
    el.style.transform = 'scale(0)';
    el.style.opacity   = '0';
  });
  locationRow.style.display = 'none';
  divider.style.display     = 'none';
}

function show(el) { el.classList.add('fadeIn'); }

async function getWeather() {
  const city = input.value.trim();
  if (!city) return;
  hideAll();

  try {
    const url  = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const res  = await fetch(url);
    const data = await res.json();

    if (data.cod === '404' || data.cod === 401) {
      show(notFound);
      return;
    }

    const main   = data.weather[0].main;
    const imgSrc = weatherImgMap[main] || weatherImgMap.Clear;

    document.getElementById('weatherImg').src        = imgSrc;
    document.getElementById('temperature').innerHTML = `${Math.round(data.main.temp)}<span>°C</span>`;
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('feelsLike').textContent   = `Feels like ${Math.round(data.main.feels_like)}°C`;
    document.getElementById('humidity').textContent    = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent   = `${data.wind.speed} m/s`;
    document.getElementById('pressure').textContent    = `${data.main.pressure} hPa`;
    document.getElementById('visibility').textContent  = `${(data.visibility / 1000).toFixed(1)} km`;
    document.getElementById('cityName').textContent    = data.name;
    document.getElementById('countryTag').textContent  = data.sys.country;

    locationRow.style.display = 'flex';
    divider.style.display     = 'block';

    show(weatherBox);
    show(weatherDetails);

  } catch (err) {
    show(notFound);
  }
}

searchBtn.addEventListener('click', getWeather);
input.addEventListener('keydown', e => { if (e.key === 'Enter') getWeather(); });