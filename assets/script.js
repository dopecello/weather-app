const app = {
  init: () => {
    document.getElementById("search-weather").addEventListener("click", app.fetchLocation);
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
        console.log(data);
      })
      .catch(console.err);
  },
};

app.init();
