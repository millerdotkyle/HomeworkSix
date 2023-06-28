var key = "9fbe4849e7907051c07050bc1201336d";

var searchesDisplayEl = document.getElementById("searches");
var searchBtn = document.getElementById("search-button");


var prevSearches = JSON.parse(localStorage.getItem("savedsearches")) || [];

var currentCity = $('input');


//print any saved searches found in local storage
printSavedCities(prevSearches);

//calls other functions to save searched city and add to list, runs weather API calls and passes data to printing functions
function getWeather(query) {
    console.log(query);
    if(query ==='') {
        query === currentCity;
    }

    saveCity(prevSearches);
    printSavedCities(prevSearches);
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + query + "&limit=1&appid=" + key)
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
    query = '';
}



//creates top card with todays weather data
function todayWeather(data) {
    console.log(data);
    var today = dayjs().format('M/DD/YYYY');

    $('#today-city').text(data.city.name + ' (' + today + ')');
    $('#today-icon').attr('src', 'https://openweathermap.org/img/wn/'+ data.list[0].weather[0].icon + '.png');
    $('#today-temp').text('Temp: ' + data.list[0].main.temp + '°F');
    $('#today-wind').text('Wind: ' + data.list[0].wind.speed + 'MPH');
    $('#today-humidity').text('Humidity: ' + data.list[0].main.humidity +'%');
}


//prints forecast to screen, takes data from API call
function printForecast (data) {
    var cardEl = $('#forecast');
    cardEl.text("");


    //loop to walk thru data, multiply the index to get next day in data
    for(var i=0; i<5; i++) {
        a = i*8;

        newIcon = data.list[0].weather[0].icon;
        var newCast = [dayjs(data.list[a].dt_txt).format('DD/MM/YYYY'), ' ', data.list[a].main.temp, data.list[a].wind.speed, data.list[a].main.humidity];
        var units = [' ', ' ', '°F', 'MPH', '%']

        var div = $("<div>");
        var ul = $('<ul>');

        //nested loop creates elements, appends and styles
        for(var j =0; j<newCast.length; j++) {

            //if statement to insert image where needed in list
            if(j===1) {
                var img = $('<img>');
                img.attr('src', 'https://openweathermap.org/img/wn/' + data.list[a].weather[0].icon + '.png');
                img.attr('class', 'icon');
                ul.append(img);
            } else{
                let li = $("<li>");
                li.text(newCast[j] + ' ' + units[j]);
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


//function to generate list from saved cities
function printSavedCities (arr) {

    var ulEl = $('#saved-cities');
    //remove existing list before printing new one
    ulEl.children().remove();

    //for loop goes length of data adding li elements to ul and stylizing them
    for(let i=0; i<arr.length; i++) {
        var li = $('<li>');
        li.text(arr[i]);
        li.addClass('btn bg-secondary mt-2 mb-2 city-button');
        ulEl.append(li);
    }
    ulEl.removeClass('hidden');

}


//saves adds current searched city to list of searches, then saves to local storage
function saveCity (prevSearches) {

    var newCity = $('input').val();
    var dupeCheck  = false;

    //check if city already exists
    for(var i =0; i<prevSearches.length; i++){
        if(newCity === prevSearches[i]) {
            dupeCheck = true;
            break;
        }
    }

    //if city is a new search, add it while removing oldest city if limit is reached
    if(dupeCheck===false){
        if(prevSearches.length >= 10){
            prevSearches.pop();
            prevSearches.unshift(newCity);
        } else {
            prevSearches.unshift(newCity);
        }
    }

    
    localStorage.setItem('savedsearches', JSON.stringify(prevSearches));
}

$('.city-button').on('click', function() {
    console.log($(this).text());
    getWeather($(this).text());
});

// $('#search-button').on('click', function() {
//     getWeather;
// });


// function clickedCity (this){
//     var query = this.val();
//     console.log(query);
// }
