var key
async function init() {
    const response = await fetch('../config.json');
    const data = await response.json();
    key = data.apikey;
    // console.log(key);
  }
  
init();
const city = document.getElementById('City');
const region = document.getElementById('Region');
const country = document.getElementById('Country');
const temp = document.getElementById('Temp');
const humidity = document.getElementById('Humidity');
const windspeed = document.getElementById('windspeed');
const units = document.getElementById('unit');

const custom_input = document.getElementById('search_input');
const search_btn = document.getElementById('search_btn');
const convert_btn = document.getElementById('convert_btn');


let isCelsius = true; // to track current temperature unit
let currentTempC;
let currentTempF; 
function reqCurrent_location() {
    return new Promise((resolve, reject) => {
        window.navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const latitude = coords.latitude;
                const longitude = coords.longitude;
                console.log(latitude, longitude);
                resolve({ latitude, longitude });
            },
            ({ message }) => {
                reject(message);
            }
        );
    });
}

async function get_data_by_location(location) {
    const { latitude, longitude } = location;
    const url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${latitude},${longitude}&aqi=no`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function custom_search(value) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${value}&aqi=no`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function updateDOM(data) {
    city.innerText = data.city;
    region.innerText = data.region;
    country.innerText = data.country;
    temp.innerText = isCelsius ? data.temp_c : data.temp_f;
    humidity.innerText = data.humidity;
    windspeed.innerText = data.windspeed
    units.innerText = isCelsius ? ' °C' : ' °F';
}

search_btn.addEventListener('click', async () => {
    const search_term = custom_input.value;
    const response = await custom_search(search_term);

    currentTempC = response.current.temp_c; // Store Celsius temperature
    currentTempF = response.current.temp_f; // Store Fahrenheit temperature

    const city = response.location.name;
    const region = response.location.region;
    const country = response.location.country;
    const temp_c = currentTempC;
    const temp_f = currentTempF;
    const humidity = response.current.humidity;
    const windspeed = response.current.wind_kph;

    updateDOM({ city, region, country, temp_c, temp_f, humidity,windspeed });
});

window.addEventListener('load', () => {
    reqCurrent_location()
        .then(get_data_by_location)
        .then((response) => {
            console.log(response);

            currentTempC = response.current.temp_c; // Store Celsius temperature
            currentTempF = response.current.temp_f; // Store Fahrenheit temperature

            const city = response.location.name;
            const region = response.location.region;
            const country = response.location.country;
            const temp_c = currentTempC;
            const temp_f = currentTempF;
            const humidity = response.current.humidity;
            const windspeed = response.current.wind_kph;

            units.innerText = ' °C';
            updateDOM({ city, region, country, temp_c, temp_f, humidity,windspeed });
        })
        .catch((err) => console.log(err));
});

convert_btn.addEventListener('click', () => {
    isCelsius = !isCelsius; // Toggle the temperature unit

    // Update the DOM based on the current unit
    temp.innerText = isCelsius ? currentTempC : currentTempF;
    units.innerText = isCelsius ? ' °C' : ' °F';
});
