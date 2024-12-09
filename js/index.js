
          /****************************************Declare Variables******************************************** */
const searchInput = document.getElementById("search");
const submitButton = document.getElementById("submit");
const dayElements = document.querySelectorAll(".day");
const dateElements = document.querySelectorAll(".date");
const locationElement = document.querySelector(".location");
const degreeElements = document.querySelectorAll(".num");
const forecastIcons = document.querySelectorAll(".forecast-icon img");
const custom=document.querySelectorAll(".custom");

const API_KEY = "65b83f1966494cf4854160958240612"; 
const BASE_URL = "https://api.weatherapi.com/v1/forecast.json";


      /****************************************AddEvent listener for search input****************************************/

searchInput.addEventListener("input", () => {
    const city = searchInput.value.trim();
    if (city) {
      fetchWeatherData(city);
    }
  });
  
      /**************************************** Function to fetch weather data****************************************/

async function fetchWeatherData(city) {
  try {
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
fetchWeatherData("Cairo");


      /**************************************** Function to update weather cards****************************************/

function updateWeatherCards(data) {

  const forecastDays = data.forecast.forecastday;

  /* to convert the date to number in month*/
  const date = new Date(forecastDays[0].date);
  const day = date.getDate(); 
  const month = date.toLocaleString('default', { month: 'long' }); 
  const formattedDate = `${day} ${month}`; 
  
  // Update today's weather
  dayElements[0].innerHTML = date.toLocaleDateString("en-US", { weekday: "long" });
  dateElements[0].innerHTML = formattedDate;
  locationElement.innerHTML = data.location.name;
  degreeElements[0].innerHTML = `${data.current.temp_c}<sup>o</sup>C`;
  forecastIcons[0].src = forecastDays[0].day.condition.icon;
  custom[0].innerHTML = forecastDays[0].day.condition.text; 

  // Update next days' weather
  for (let i = 1; i < forecastDays.length; i++) {
    dayElements[i].innerHTML = new Date(forecastDays[i].date).toLocaleDateString("en-US", { weekday: "long" });
    degreeElements[i].innerHTML = `${forecastDays[i].day.maxtemp_c}<sup>o</sup>C`;
    forecastIcons[i].src = forecastDays[i].day.condition.icon;
    custom[i].textContent = forecastDays[i].day.condition.text; 
    const minTemp = (forecastDays[i].day.mintemp_c);
    if (i === 1) {
        const smallestTempElement = document.querySelectorAll(".smallest-tem")[0]; 
        smallestTempElement.innerHTML = `${minTemp}<sup>o</sup>`;
      } else if (i === 2) {
        const smallestTempElement = document.querySelectorAll(".smallest-tem")[1]; 
        smallestTempElement.innerHTML = `${minTemp}<sup>o</sup>`;
      }
    }
  }
  

      /****************************************Function to get user's current location****************************************/

// function getUserLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         fetchWeatherData(`${latitude},${longitude}`);
//       },
//       () => {
//         // If location access is denied, default to Cairo
//         fetchWeatherData("Cairo");
//       }
//     );
//   } else {
//     // If geolocation is not supported, default to Cairo
//     fetchWeatherData("Cairo");
//   }
// }

// getUserLocation()



               /**************************************** Done****************************************/

