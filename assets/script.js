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
  fetchWeather: (weather) => {
    let lat = weather.lat;
    let lon = weather.lon;
    let key = "cc1eec67d9c183eb5563d87e72e89138";
    let url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=imperial&lang=en`;
    fetch(url)
      .then((resp) => {
        if (!resp.ok) throw new Error(resp.statusText);
        return resp.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch(console.err);
  },
};

app.init();
