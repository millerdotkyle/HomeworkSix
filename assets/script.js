var key = "9fbe4849e7907051c07050bc1201336d";
// var today = dayjs();


var searchesDisplayEl = document.getElementById("searches");
var searchBtn = document.getElementById("search-button");


var prevSearches =localStorage.getItem("savedsearches") || [];


var currentCity = $('input[name="City"]');


function getWeather() {
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + currentCity.val() + "&limit=1&appid=" + key)
    .then(function(response) {
        return response.json();
    })
    .then(function(data){
        fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + data[0].lat + "&lon=" + data[0].lon + "&appid=" + key)
        .then(function(response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            for(i=0; i<5; i++) {
                var a = i * 8;
                console.log(data.list[a]);
            }
        })
    })
}

searchBtn.addEventListener("click", getWeather);