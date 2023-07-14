function updateDateTime() {
    const date = new Date();
    console.log(date);
    dateElement = date.toUTCString().slice(0,16);
    time = date.toLocaleTimeString();

    const datetimeElement = document.querySelector('.date-time');
    datetimeElement.innerHTML = `<p><strong>${dateElement}</strong>
      <br><span id="time"><strong>${time}</strong></span></p>`;
       
    }

    // Call the function to initially display current date and time
    updateDateTime();
    console.log(dateElement);

    // Update current date and time every second
    setInterval(updateDateTime, 1000);


const url = (lat, long) => `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,precipitation,cloudcover,windspeed_120m`; //API for fetching weather attributes
const geocodeURL = (lat, long) =>`https://api.geocodify.com/v2/reverse
?api_key=8b1756f51f1431104f668fe0f68f2f7215dc8e98&lat=${lat}&lng=${long}`; // API for fetching region 

async function getWeather(lat, long) {
try {
const resp = await fetch(url(lat, long), { mode: 'cors' });
const respData = await resp.json();
console.log('respData', respData);
addToPage(respData,lat,long);
} catch (error) {
console.log('Error fetching weather data:', error);
}
}
async function getGeocode(lat, long) {
try {
const resp = await fetch(geocodeURL(lat, long), { mode: 'cors' });
const respData = await resp.json();
console.log(respData);

if (respData.error) {
console.log('Error fetching geocode data:', respData.error);
return 'Unknown Location';
}

const features = respData.response.features;
const firstFeature = features[0];
const properties = firstFeature.properties;
const country = properties.country;
const region = properties.region;
const continent = properties.continent

console.log('Country:', country);
console.log('Region:', region);
console.log('continent', continent);

const location = { region: region,
country: country, 
continent: continent };

console.log('Location data:', location);
return location;


} catch (error) {
console.log('Error fetching geocode data:', error);
return 'Unknown Location';
}
}

async function addToPage(weatherData,lat,long) {
const main = document.getElementById('main');

const temperature = weatherData.hourly.temperature_2m[0];
const windSpeed = weatherData.hourly.windspeed_120m[0];
const cloudCover = weatherData.hourly.cloudcover[0];


const location = await getGeocode(lat, long);

const { region, country, continent } = location;
//object destruction


const locationElement = document.createElement('div');
locationElement.innerHTML = 
`<p><strong>Country</strong> <span class="content-gap" id="country"> ${country}</p>
<p><strong>Region</strong> <span class="content-gap" id="region"> ${region}</p>
<p><strong>Continent</strong> <span class="content-gap" id="continent"> ${continent}</p>`;

                       
locationElement.classList.add('location');

const weatherElement = document.createElement('div');
weatherElement.innerHTML = 
`<p><strong>Temperature</strong> <span class="content-gap" id="temperature"> ${temperature}°C </p>
<p><strong>Wind Speed</strong> <span class="content-gap" id="wind-speed"> ${windSpeed} m/s</p>
<p><strong>Cloud Cover</strong> <span class="content-gap" id="cloud-cover">${cloudCover}% </p>`;


main.innerHTML = '';
main.appendChild(locationElement);
main.appendChild(weatherElement);



const body= document.body;
body.classList.remove('cold','normal','hot');
if (temperature < 10) {
body.classList.add('cold');
} else if (temperature >= 10 && temperature <= 25) {
body.classList.add('normal');
}
else {
body.classList.add('hot');
}
}


const form = document.getElementById('form');
form.addEventListener('submit', async (e) => {

e.preventDefault();

const lat = document.getElementById('latitude').value;
const long = document.getElementById('longitude').value;
const latitude = parseFloat(lat);
const longitude = parseFloat(long);
if (isNaN(latitude) || isNaN(longitude)) {
console.log('Invalid latitude or longitude values');
return;
}

try {
await getWeather(latitude, longitude);
} catch (error) {
console.log('Error fetching weather data:', error);
}

});

