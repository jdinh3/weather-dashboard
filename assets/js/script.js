var searchForm = $("#search-form");
var searchTermEl = $("#search-term");
var tempEl = $("#temp-overview");
var overviewEl = $("#overview-list");
var humidityEl = $("#humidity-overview");
var windSpeedEl = $("#windspeed-overview");
var uvIndexEl = $("#uvindex-overview");
var cityEl = $("#city-name");

searchForm.on("submit", function (event) {
  event.preventDefault();
  var searchTerm = searchTermEl.val();
  console.log(searchTerm);

  var apiKey = "e919f026e83901dae380556be5bccfeb";
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchTerm +
    "&units=imperial&appid=" +
    apiKey;

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      var city = $("<h4>");
      var temperatureEl = $("<li>");
      var humidEl = $("<li>");
      var windEl = $("<li>");
      var iconEl = $("<img>");

      //   iconEl.attr("src", data.weather[0].icon);
      city.text = searchTerm;
      temperatureEl.text = "Temperature: " + data.main.temp + "°";
      humidEl.text = "Humidity: " + data.main.humidity + "%";
      windEl.text = "Wind Speed: " + data.wind.speed + " mph";
      cityEl.text(city.text);
      tempEl.text(temperatureEl.text);
      humidityEl.text(humidEl.text);
      windSpeedEl.text(windEl.text);

      var uvURL =
        "https://api.openweathermap.org/data/2.5/uvi?lat=" +
        data.coord.lat +
        "&lon=" +
        data.coord.lon +
        "&appid=" +
        apiKey;

      fetch(uvURL)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var uvEl = $("<li>");
          uvEl.text = "UV Index: " + data.value;
          uvIndexEl.text(uvEl.text);
        });
    });
});
