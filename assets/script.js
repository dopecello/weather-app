const app = {
  init: () => {
    document
      .getElementById("search-weather")
      .addEventListener("click", app.fetchLocation);
  },

  fetchLocation: () => {
    let cityName = document.getElementById("city-input").value;
    let stateCode = document.getElementById("state-input").value;
    let countryCode = document.getElementById("country-input").value;
    let key = "cc1eec67d9c183eb5563d87e72e89138";
    let limit = 1;
    let url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=${key}`;

    if (url) {
      fetch(url)
        .then((resp) => {
          if (!resp.ok) throw new Error(resp.statusText);
          return resp.json();
        })
        .then((data) => {
          let usableData = {};
          usableData.lat = data[0].lat;
          usableData.lon = data[0].lon;
          app.fetchWeather(usableData);
        })
        .catch(console.err);
    }
  },

  fetchStoredLocation: (storage) => {
    let storageCity = storage.city;
    let storageCountry = storage.country;
    let key = "cc1eec67d9c183eb5563d87e72e89138";
    let limit = 1;
    let storageUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${storageCity},${storageCountry}&limit=${limit}&appid=${key}`;

    if (storageUrl) {
      fetch(storageUrl)
        .then((resp) => {
          if (!resp.ok) throw new Error(resp.statusText);
          return resp.json();
        })
        .then((data) => {
          let usableStorageData = {};
          usableStorageData.lat = data[0].lat;
          usableStorageData.lon = data[0].lon;
          app.fetchWeather(usableStorageData);
        })
        .catch(console.err);
    }
  },

  fetchWeather: (location) => {
    const currentWeatherBox = document.getElementById("weather-box");
    const forecastTitle = document.getElementById("forecast-title");
    const currentForecastTitle = document.getElementById(
      "currentforecast-title"
    );
    const forecastBox = document.getElementById("five-day-forecast");
    const weatherCard1 = document.getElementById("weather-card-1");
    const weatherCard2 = document.getElementById("weather-card-2");
    const weatherCard3 = document.getElementById("weather-card-3");
    const weatherCard4 = document.getElementById("weather-card-4");
    const weatherCard5 = document.getElementById("weather-card-5");
    let lat = location.lat;
    let lon = location.lon;
    let key = "cc1eec67d9c183eb5563d87e72e89138";
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=imperial&lang=en`;

    fetch(url)
      .then((resp) => {
        if (!resp.ok) throw new Error(resp.statusText);
        return resp.json();
      })
      .then((data) => {
        if (data) {
          currentWeatherBox.classList.remove("hide");
          forecastTitle.classList.remove("hide");
          currentForecastTitle.classList.remove("hide");
          forecastBox.classList.remove("hide");
          weatherCard1.classList.remove("hide");
          weatherCard2.classList.remove("hide");
          weatherCard3.classList.remove("hide");
          weatherCard4.classList.remove("hide");
          weatherCard5.classList.remove("hide");
        }

        // current forecast values
        let currentForecast = {};
        currentForecast.city = data.city.name;
        currentForecast.country = data.city.country;
        currentForecast.currentIcon = data.list[0].weather[0].icon;
        currentForecast.currentIconDes = data.list[0].weather[0].description;
        currentForecast.temp = data.list[0].main.temp;
        currentForecast.wind = data.list[0].wind.speed;
        currentForecast.humidity = data.list[0].main.humidity;

        //five-day forecast values
        let threeHourArray = data.list;
        let fiveDayForecast = [];
        fiveDayForecast.push(
          threeHourArray[0],
          threeHourArray[8],
          threeHourArray[16],
          threeHourArray[24],
          threeHourArray[32]
        );

        //save to localStorage
        let searchHistory = {};
        searchHistory.city = data.city.name;
        searchHistory.country = data.city.country;

        //pass data
        app.displayCurrentForecast(currentForecast);
        app.displayFiveDayForecast(fiveDayForecast);
        app.saveSearch(searchHistory);
      })
      .catch(console.err);
  },

  saveSearch: (passedCity) => {
    const searchHistoryArea = document.getElementById("searchContainer");
    localStorage.setItem("city", passedCity.city);
    let searchHistoryButtonInput = localStorage.getItem("city");
    let searchHistoryButton = document.createElement("button");
    searchHistoryButton.classList.add(
      "button",
      "is-warning",
      "column",
      "is-12",
      "has-text-centered",
      "p-2",
      "mb-3"
    );

    searchHistoryButton.onclick = function () {
      let storageObject = {};
      document.getElementById("city-input").value = "";
      document.getElementById("state-input").value = "";
      document.getElementById("country-input").value = "";
      city = passedCity.city;
      country = passedCity.country;
      storageObject.city = city;
      storageObject.country = country;
      app.fetchStoredLocation(storageObject);
    };

    searchHistoryButton.innerText = searchHistoryButtonInput;
    searchHistoryArea.appendChild(searchHistoryButton);
  },

  displayCurrentForecast: (weatherResp) => {
    const cityInsert = document.getElementById("city");
    const countryInsert = document.getElementById("country");
    const weatherIconInsert = document.getElementById("current-weather-icon");
    const tempInsert = document.getElementById("current-temp");
    const windInsert = document.getElementById("current-wind");
    const humidityInsert = document.getElementById("current-humidity");
    cityInsert.innerText = weatherResp.city + ", ";
    countryInsert.innerText = weatherResp.country;
    weatherIconInsert.innerHTML =
      "<img src='https://openweathermap.org/img/wn/" +
      weatherResp.currentIcon +
      ".png'>" +
      "(" +
      weatherResp.currentIconDes +
      ")";
    tempInsert.innerText = "Temp: " + weatherResp.temp + "°F";
    windInsert.innerText = "Wind: " + weatherResp.wind + "MPH";
    humidityInsert.innerText = "Humidity: " + weatherResp.humidity + "%";
  },

  displayFiveDayForecast: (weatherResp) => {
    const currentWeatherTitle = document.getElementById(
      "currentforecast-title"
    );
    const weatherCard1 = document.getElementById("weather-card-1");
    const weatherCard2 = document.getElementById("weather-card-2");
    const weatherCard3 = document.getElementById("weather-card-3");
    const weatherCard4 = document.getElementById("weather-card-4");
    const weatherCard5 = document.getElementById("weather-card-5");
    
    timesArray = [];
    timesArray.push(
      weatherResp[0].dt,
      weatherResp[1].dt,
      weatherResp[2].dt,
      weatherResp[3].dt,
      weatherResp[4].dt
    );
    convertedTimesArray = timesArray.map((date) =>
      new Date(date * 1000).toLocaleDateString("en-US")
    );

    currentWeatherTitle.innerText =
      "Current Weather on " + convertedTimesArray[0];

    weatherCard1.innerHTML = `<div class="card-header">
        <div class="card-header-title">
            ${convertedTimesArray[0]} <img src="https://openweathermap.org/img/wn/${weatherResp[0].weather[0].icon}.png">
        </div>
    </div>
    <div class="card-content">
        <div class="content">
            <p class="mb-3"><strong>Temp:</strong> ${weatherResp[0].main.temp} °F</p>
            <p class="mb-3"><strong>Wind:</strong> ${weatherResp[0].wind.speed}mph</p>
            <p><strong>Humidity:</strong> ${weatherResp[0].main.humidity}%</p>
        </div>
    </div>`;

    weatherCard2.innerHTML = `<div class="card-header">
        <div class="card-header-title">
            ${convertedTimesArray[1]} <img src="https://openweathermap.org/img/wn/${weatherResp[1].weather[0].icon}.png">
        </div>
    </div>
    <div class="card-content">
        <div class="content">
            <p class="mb-3"><strong>Temp:</strong> ${weatherResp[1].main.temp} °F</p>
            <p class="mb-3"><strong>Wind:</strong> ${weatherResp[1].wind.speed}mph</p>
            <p><strong>Humidity:</strong> ${weatherResp[1].main.humidity}%</p>
        </div>
    </div>`;

    weatherCard3.innerHTML = `<div class="card-header">
        <div class="card-header-title">
            ${convertedTimesArray[2]} <img src="https://openweathermap.org/img/wn/${weatherResp[2].weather[0].icon}.png">
        </div>
    </div>
    <div class="card-content">
        <div class="content">
            <p class="mb-3"><strong>Temp:</strong> ${weatherResp[2].main.temp} °F</p>
            <p class="mb-3"><strong>Wind:</strong> ${weatherResp[2].wind.speed}mph</p>
            <p><strong>Humidity:</strong> ${weatherResp[2].main.humidity}%</p>
        </div>
    </div>`;

    weatherCard4.innerHTML = `<div class="card-header">
        <div class="card-header-title">
            ${convertedTimesArray[3]} <img src="https://openweathermap.org/img/wn/${weatherResp[3].weather[0].icon}.png">
        </div>
    </div>
    <div class="card-content">
        <div class="content">
            <p class="mb-3"><strong>Temp:</strong> ${weatherResp[3].main.temp} °F</p>
            <p class="mb-3"><strong>Wind:</strong> ${weatherResp[3].wind.speed}mph</p>
            <p><strong>Humidity:</strong> ${weatherResp[3].main.humidity}%</p>
        </div>
    </div>`;

    weatherCard5.innerHTML = `<div class="card-header">
        <div class="card-header-title">
            ${convertedTimesArray[4]} <img src="https://openweathermap.org/img/wn/${weatherResp[4].weather[0].icon}.png">
        </div>
    </div>
    <div class="card-content">
        <div class="content">
            <p class="mb-3"><strong>Temp:</strong> ${weatherResp[4].main.temp} °F</p>
            <p class="mb-3"><strong>Wind:</strong> ${weatherResp[4].wind.speed}mph</p>
            <p><strong>Humidity:</strong> ${weatherResp[4].main.humidity}%</p>
        </div>
    </div>`;
  },
};

app.init();
