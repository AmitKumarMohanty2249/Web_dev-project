// --- Weather API logic ---
const apiKey = "4ca9153d52b9a78a8e93e2564941ba1b";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".search input");
const searchForm = document.querySelector(".search");
const weatherIcon = document.querySelector(".weather-icon");

async function checkweather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  if (response.status == 404) {
    showError(true);
    document.querySelector(".weather").style.display = "none";
  } else {
    var data = await response.json();
    updateWeatherUI(data);
    showError(false);
    document.querySelector(".weather").style.display = "block";
  }
}

function animateTemperature(newTemp) {
  const tempElem = document.querySelector('.temp');
  const current = parseInt(tempElem.textContent);
  const target = parseInt(newTemp);
  if (isNaN(current) || isNaN(target)) {
    tempElem.textContent = newTemp + '°c';
    return;
  }
  let frame = 0;
  const frames = 30;
  const diff = target - current;
  function step() {
    frame++;
    const val = Math.round(current + (diff * frame / frames));
    tempElem.textContent = val + '°c';
    if (frame < frames) requestAnimationFrame(step);
    else tempElem.textContent = target + '°c';
  }
  step();
}

function updateWeatherUI(data) {
  document.querySelector('.city').textContent = data.name;
  animateTemperature(Math.round(data.main.temp));
  document.querySelector('.humidity').textContent = data.main.humidity + '%';
  document.querySelector('.wind').textContent = data.wind.speed + 'km/h';
  // Update icon (use root path)
  if (data.weather[0].main == "Clouds") {
    weatherIcon.src = "clouds.png";
  } else if (data.weather[0].main == "Clear") {
    weatherIcon.src = "clear.png";
  } else if (data.weather[0].main == "Rain") {
    weatherIcon.src = "rain.png";
  } else if (data.weather[0].main == "Drizzle") {
    weatherIcon.src = "drizzle.png";
  } else if (data.weather[0].main == "Mist") {
    weatherIcon.src = "mist.png";
  } else if (data.weather[0].main == "Snow") {
    weatherIcon.src = "snow.png";
  } else if (data.weather[0].main == "Fog") {
    weatherIcon.src = "mist.png";
  } else if (data.weather[0].main == "Thunderstorm") {
    weatherIcon.src = "rain.png";
  }
}

// Show/hide error message smoothly
function showError(show) {
  const errorDiv = document.querySelector('.error');
  if (errorDiv) {
    errorDiv.style.display = show ? 'block' : 'none';
  }
}

// --- Theme toggle logic ---
function setTheme(night) {
  if (night) {
    document.body.classList.add('night');
    localStorage.setItem('theme', 'night');
  } else {
    document.body.classList.remove('night');
    localStorage.setItem('theme', 'day');
  }
}
// Load theme from storage
if (localStorage.getItem('theme') === 'night') {
  setTheme(true);
}
const toggleBtn = document.querySelector('.theme-toggle');
toggleBtn && toggleBtn.addEventListener('click', () => {
  setTheme(!document.body.classList.contains('night'));
});

// --- Form submit handler ---
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  checkweather(searchBox.value);
});