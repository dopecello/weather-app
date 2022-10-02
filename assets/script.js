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
    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=${key}`;
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
  },
  fetchWeather: (location) => {
    let lat = location.lat;
    let lon = location.lon;
    let key = "cc1eec67d9c183eb5563d87e72e89138";
    let url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=imperial&lang=en`;
    fetch(url)
      .then((resp) => {
        if (!resp.ok) throw new Error(resp.statusText);
        return resp.json();
      })
      .then((data) => {
        console.log(data)
        let currentForecast = {}
        currentForecast.city = data.city.name
        currentForecast.country = data.city.country
        currentForecast.currentIcon = data.list[0].weather[0].icon
        currentForecast.currentIconDes = data.list[0].weather[0].description
        currentForecast.temp = data.list[0].main.temp
        currentForecast.wind = data.list[0].wind.speed
        currentForecast.humidity = data.list[0].main.humidity
        app.displayCity(currentForecast)
      })
      .catch(console.err);
  },
  displayCity: (weatherResp) => {
    const cityInsert = document.getElementById("city")
    const countryInsert = document.getElementById("country")
    const weatherIconInsert = document.getElementById("current-weather-icon")
    const tempInsert = document.getElementById("current-temp")
    const windInsert = document.getElementById("current-wind")
    const humidityInsert = document.getElementById("current-humidity")
    cityInsert.innerText = weatherResp.city
    countryInsert.innerText = weatherResp.country
    weatherIconInsert.innerHTML = "<img src='https://openweathermap.org/img/wn/" + weatherResp.currentIcon + ".png'>" + "(" + weatherResp.currentIconDes + ")"
    tempInsert.innerText = "Temp: " + weatherResp.temp + " °F"
    windInsert.innerText = "Wind: " + weatherResp.wind + " MPH"
    humidityInsert.innerText = "Humidity: " + weatherResp.humidity + "%"
  }
};

app.init();
