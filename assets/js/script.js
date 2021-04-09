// Dom Variables
var searchForm = $("#search-form");
var searchTermEl = $("#search-term");
var tempEl = $("#temp-overview");
var overviewEl = $("#overview-list");
var humidityEl = $("#humidity-overview");
var windSpeedEl = $("#windspeed-overview");
var uvIndexEl = $("#uvindex-overview");
var cityEl = $("#city-name");
var cardDateEl = $(".card-date");
var cardIconEl = $(".card-icon");
var cardTempEl = $(".temp");
var cardHumidityEl = $(".humidity");
var iconEl = $("#icon");
//var cities = [];
const searchContainer = $("#searchContainer");

// Event Listener for submit button
searchForm.on("submit", function (event) {
  event.preventDefault();
  var searchTerm = searchTermEl.val();
  if (searchTerm) {
    apiCalls(searchTerm);
  }
});

function apiCalls(searchTerm) {
  var apiKey = "e919f026e83901dae380556be5bccfeb";
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchTerm +
    "&units=imperial&appid=" +
    apiKey;

  // Data for the current weather overview
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
      setCity(searchTerm);
      //   iconEl.attr("src", data.weather[0].icon);
      currentDate = moment().format("L");
      city.text = data.name + " (" + currentDate + ")";

      temperatureEl.text = "Temperature: " + data.main.temp + "°F";
      humidEl.text = "Humidity: " + data.main.humidity + "%";
      windEl.text = "Wind Speed: " + data.wind.speed + " MPH";
      cityEl.text(city.text);
      tempEl.text(temperatureEl.text);
      humidityEl.text(humidEl.text);
      windSpeedEl.text(windEl.text);

      // Data for the UV index in the current weather overview
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

          if (data.value >= 6) {
            uvIndexEl.addClass("red");
          } else if (data.value >= 3 || data.value <= 5) {
            uvIndexEl.addClass("yellow");
          } else if (data.value <= 2) {
            uvIndexEl.addClass("green");
          }
        });
    });

  // 5-day Forecast
  var forecastURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    searchTerm +
    "&units=imperial&appid=" +
    apiKey;

  fetch(forecastURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(typeof data);
      console.log(data);
      let card_index = 0;

      // for loop to generate info in the 5-day forecast
      for (var i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.includes("15:00:00")) {
          console.log(data.list[i]);
          var icon = data.list[i].weather[0].icon;
          var iconURL = `http://openweathermap.org/img/w/${icon}.png`;
          var temp = data.list[i].main.temp;
          var date = data.list[i].dt_txt;
          var humidity = data.list[i].main.humidity + "%";
          $(cardIconEl[card_index]).attr("src", iconURL);
          //   overview icon
          $(iconEl).attr("src", iconURL);
          date = moment(date, "YYYY-MM-DD HH:mm").format("dddd, MMMM Do");
          $(cardTempEl[card_index]).text("Temperature: " + temp + "°F");
          $(cardDateEl[card_index]).text(date);
          $(cardHumidityEl[card_index]).text("Humidity: " + humidity);
          card_index++;
        }
      }
    });
}
// local storage function
// Generates the button when user presses search
function setCity(city) {
  let cities = JSON.parse(localStorage.getItem("cities"));
  if (cities === null) {
    cities = [];
  }

  if(!cities.includes(city)){
  cities.push(city);
  localStorage.setItem("cities", JSON.stringify(cities));
  let searchBtn = $("<a>")
    .attr("href", "#")
    .addClass("searchBtn list-group-item list-group-item-action");
  searchBtn.text(city);
  searchContainer.append(searchBtn);
  }
}

// generates the buttons when page reloads
function getCities() {
  let cities = JSON.parse(localStorage.getItem("cities"));
  if (cities) {
    for (i = 0; i < cities.length; i++) {
      let searchBtn = $("<a>")
        .attr("href", "#")
        .addClass("searchBtn list-group-item list-group-item-action");
      searchBtn.text(cities[i]);
      searchContainer.append(searchBtn);
    }
  }
}

getCities();

$("#searchContainer").on("click", function (event) {
  console.log(event.target);

  //this may not be a button but that's what we need, we're getting the element we're targeting with searchContainer which may be the container itself -> not what we want
  const button = event.target;
  //if the element has text, it's a button, we're good
  const text = button.textContent;

  //if text is TRUE then it has text, meaning it's a button for the city
  if (text) {
    apiCalls(text);
  }
});
