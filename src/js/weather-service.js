export const weatherBlock = document.querySelector('#weather');

const API_KEY = '0a142dd41db52da1a7f6b2fdf16ad4dd';

checkLocation();

//Функція запиту на сервер погоди//

async function loadWeather(lat, lon) {
  showLoading();
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (response.ok) {
      hideLoading();
      getWeatherData(data);
    } else {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    hideLoading();
  }
}

// Функція отримання данних з відповіді від сервера погоди та розмітки цих двнних//

function getWeatherData(data) {
  const weatherIcon = data.weather[0].icon;

  const temperature = Math.round(data.main.temp);
  const weatherDescription = data.weather[0].main;
  const location = data.name;

  const currentDate = data.dt;
  const date = new Date(currentDate * 1000);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const formattedDate = `${dayOfWeek} <br> ${dayOfMonth} ${month} ${year}`;

  const svgA = new URL('../images/icons.svg', import.meta.url);
  const svgB = 'icon-carbon_location-filled';

  const template = `
  <div class="weather__main">
  <p class="weather__temp">${temperature}&deg;</p>

  <div class="weather__container">
    <p class="weather__desk">${weatherDescription}</p>
    <div class="weather__location">
      <svg class="weather__location-icon" width=18 height=18>
        <use href="${svgA}#${svgB}"></use>
      </svg>
      <p class="weather__location-city">${location}</p>
    </div>
  </div>
  </div>
  <img class="weather__icon" src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" />
  <div class="current__date">${formattedDate}</div>
  <button class="weather__btn">Weather for Week</button>`;

  weatherBlock.innerHTML = template;

  // const weatherBtn = document.querySelector('.weather__btn');
  // weatherBtn.addEventListener('click', () => {
  //   loadWeatherWeek(data.coord.lat, data.coord.lon);
  // });

  const weatherBtn = document.querySelector('.weather__btn');
  weatherBtn.addEventListener('click', async () => {
    const baseUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&cnt=7&appid=${API_KEY}`;
    try {
      const response = await fetch(baseUrl);
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        showWeatherWeek(data);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  });
}

// async function loadWeatherWeek(lat, lon) {
//   try {
//     const baseUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=7&appid=${API_KEY}`;
//     const response = await fetch(baseUrl);
//     const data = await response.json();

//     if (response.ok) {
//       console.log(data);
//       showWeatherWeek(data);
//     } else {
//       console.log(error);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

function showWeatherWeek(data) {
  cleanWeatherBlock();
  const dailyWeather = [];
  for (let item = 0; item < 7; item += 1) {
    dailyWeather.push(data.daily[item]);
  }
  const weatherList = dailyWeather
    .map(item => {
      const weatherIcon = item.weather[0].icon;
      const weatherDescription = item.weather[0].description;
      const maxTemperature = Math.round(item.temp.max);
      const minTemperature = Math.round(item.temp.min);
      const currentDate = item.dt_txt.split(' ').splice(0, 1).join();

      return `
        <div class="weather__week-day">
          <p class="weather__week-day-name">${currentDate}</p>
          <img class="weather__week-icon" src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="${weatherDescription}">
          <div class="weather__week-temp">
            <span class="weather__week-max-temp">${maxTemperature}&deg;</span>
            <span class="weather__week-min-temp">${minTemperature}&deg;</span>
          </div>
        </div>
      `;
    })
    .join('');
  const markup = `
    <div class="weather__week">
      ${weatherList}
    </div>
  `;

  weatherBlock.innerHTML = markup;
}

// Перевірка геолокації //
function checkLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        await loadWeather(lat, lon);
      },
      () => {
        console.log('Geolocation is not supported by this browser.');
        // за замовчуванням геолокація Нью-Йорк
        const defaultLat = 40.7128;
        const defaultLon = -74.006;
        loadWeather(defaultLat, defaultLon);
      }
    );
  } else {
    console.log('Geolocation is not supported by this browser.');
    // за замовчуванням геолокація Нью-Йорк
    const defaultLat = 40.7128;
    const defaultLon = -74.006;
    loadWeather(defaultLat, defaultLon);
  }
}

const loading = document.getElementById('loading');

function showLoading() {
  loading.style.display = 'block';
}

function hideLoading() {
  loading.style.display = 'none';
}

function cleanWeatherBlock() {
  weatherBlock.innerHTML = '';
}
