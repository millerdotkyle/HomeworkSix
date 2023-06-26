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
        fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + data[0].lat + "&lon=" + data[0].lon + "&appid=" + key + "&units=imperial")
        .then(function(response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            todayWeather(data);
            printForecast(data);
        })
    })
}

searchBtn.addEventListener("click", getWeather);

function todayWeather(data) {
    console.log(data);
    var today = dayjs().format('MMM D, YYYY');

    $('#today-city').text('City: ' + data.city.name + ' ' + today);
    $('#today-temp').text('Temp: ' + data.list[0].main.temp + '*F');
    $('#today-wind').text('Wind: ' + data.list[0].wind.speed + 'MPH');
    $('#today-humidity').text('Humidity: ' + data.list[0].main.humidity +'%');
}

function printForecast (data) {
    var cardEl = $('#forecast');

    for(i=0; i<5; i++) {
        a = i*8;

        var newcast = [dayjs(data.list[a].dt_txt).format('dddd'), data.list[a].main.temp, data.list[a].wind.speed, data.list[a].main.humidity];

        var div = $("<div>");
        var ul = $('<ul>');
        $.each(newcast, function(i, item) {
            let li = $("<li>");
            li.text(item);
            li.addClass('list-group-item');
            ul.append(li);
        });

        ul.addClass('list-group list-group-flush');
        div.addClass('col');
        div.append(ul);
        cardEl.append(div);
    }

}