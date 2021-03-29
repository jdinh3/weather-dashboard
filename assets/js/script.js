var searchForm = $("#search-form");
var searchTermEl = $("#search-term");

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
    });
});
