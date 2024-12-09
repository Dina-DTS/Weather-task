/****************************************Declare Variables********************************************/
const searchInput = document.getElementById("search");
const dayElements = document.querySelectorAll(".day");
const dateElements = document.querySelectorAll(".date");
const locationElement = document.querySelector(".location");
const degreeElements = document.querySelectorAll(".num");
const forecastIcons = document.querySelectorAll(".forecast-icon img");
const custom = document.querySelectorAll(".custom");
const smallestTempElements = document.querySelectorAll(".smallest-tem");

const API_KEY = "65b83f1966494cf4854160958240612";
const BASE_URL = "http://api.weatherapi.com/v1/forecast.json"; // Updated Base URL for 3-day forecast

/****************************************Add Event Listener for Search Input****************************************/

searchInput.addEventListener("input", () => {
  const city = searchInput.value.trim();
  if (city) {
    fetchWeatherData(city);
  }
});

/**************************************** Function to Fetch Weather Data****************************************/

async function fetchWeatherData(city) {
  try {
    // Updated URL for 3-day forecast data
    const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${city}&days=3`);
    const data = await response.json();
    console.log(data);

    if (data.error) {
      alert("Error: " + data.error.message);
      return;
    }

    updateWeatherCards(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

fetchWeatherData("Cairo"); // Default city on page load

/**************************************** Function to Update Weather Cards****************************************/

function updateWeatherCards(data) {
  const forecastDays = data.forecast.forecastday;

  // Update today's weather
  const today = new Date(forecastDays[0].date);
  const day = today.getDate();
  const month = today.toLocaleString("default", { month: "long" });
  const formattedDate = `${day} ${month}`;

  dayElements[0].innerHTML = today.toLocaleDateString("en-US", { weekday: "long" });
  dateElements[0].innerHTML = formattedDate;
  locationElement.innerHTML = data.location.name;
  degreeElements[0].innerHTML = `${data.current.temp_c}<sup>o</sup>C`;
  forecastIcons[0].src = forecastDays[0].day.condition.icon;
  custom[0].innerHTML = forecastDays[0].day.condition.text;

  // Update next days' weather
  for (let i = 1; i < forecastDays.length; i++) {
    const forecastDate = new Date(forecastDays[i].date);
    dayElements[i].innerHTML = forecastDate.toLocaleDateString("en-US", { weekday: "long" });
    dateElements[i].innerHTML = `${forecastDate.getDate()} ${forecastDate.toLocaleString("default", { month: "long" })}`;
    degreeElements[i].innerHTML = `${forecastDays[i].day.maxtemp_c}<sup>o</sup>C`;
    forecastIcons[i].src = forecastDays[i].day.condition.icon;
    custom[i].textContent = forecastDays[i].day.condition.text;
    smallestTempElements[i - 1].innerHTML = `${forecastDays[i].day.mintemp_c}<sup>o</sup>`;
  }
}

/****************************************Function to Get User's Current Location****************************************/

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData(`${latitude},${longitude}`);
      },
      () => {
        // If location access is denied, default to Cairo
        fetchWeatherData("Cairo");
      }
    );
  } else {
    // If geolocation is not supported, default to Cairo
    fetchWeatherData("Cairo");
  }
}

getUserLocation();

/**************************************** Done ****************************************/
