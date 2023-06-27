var key = "9fbe4849e7907051c07050bc1201336d";




var searchesDisplayEl = document.getElementById("searches");
var searchBtn = document.getElementById("search-button");


var prevSearches = JSON.parse(localStorage.getItem("savedsearches")) || [];



var currentCity = $('input[name="City"]');

printSavedCities(prevSearches);


function getWeather() {
    saveCity(prevSearches);
    printSavedCities(prevSearches);
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
            todayWeather(data);
            printForecast(data);
        })
    })
}

searchBtn.addEventListener("click", getWeather);

function todayWeather(data) {
    console.log(data);
    var today = dayjs().format('M/DD/YYYY');

    $('#today-city').text(data.city.name + ' (' + today + ')');
    $('#today-icon').attr('src', 'https://openweathermap.org/img/wn/'+ data.list[0].weather[0].icon + '.png');
    $('#today-temp').text('Temp: ' + data.list[0].main.temp + '°F');
    $('#today-wind').text('Wind: ' + data.list[0].wind.speed + 'MPH');
    $('#today-humidity').text('Humidity: ' + data.list[0].main.humidity +'%');
}

function printForecast (data) {
    var cardEl = $('#forecast');
    cardEl.text("");

    for(var i=0; i<5; i++) {
        a = i*8;

        newIcon = data.list[0].weather[0].icon;
        var newcast = [dayjs(data.list[a].dt_txt).format('DD/MM/YYYY'), ' ', data.list[a].main.temp, data.list[a].wind.speed, data.list[a].main.humidity];
        var units = [' ', ' ', '°F', 'MPH', '%']

        var div = $("<div>");
        var ul = $('<ul>');

        for(var j =0; j<newcast.length; j++) {
            if(j===1) {
                var img = $('<img>');
                img.attr('src', 'https://openweathermap.org/img/wn/' + data.list[a].weather[0].icon + '.png');
                img.attr('class', 'icon');
                ul.append(img);
            } else{
                let li = $("<li>");
                li.text(newcast[j] + ' ' + units[j]);
                li.addClass('list-group-item');
    
                ul.append(li);
            }

        }



        ul.addClass('list-group list-group-flush');
        div.addClass('col day-card pl-2 pr-2');
        div.append(ul);
        cardEl.append(div);
    }

}

function printSavedCities (arr) {


    var ulEl = $('#saved-cities');
    ulEl.children().remove();
    for(let i=0; i<arr.length; i++) {
        var li = $('<li>');
        li.text(arr[i]);
        li.addClass('btn bg-secondary mt-2 mb-2');
        ulEl.append(li);
    }
    ulEl.removeClass('hidden');

}

function saveCity (prevSearches) {
    prevSearches.push($('input').val());
    localStorage.setItem('savedsearches', JSON.stringify(prevSearches));
}