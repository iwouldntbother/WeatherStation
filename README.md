# CCI Diploma

## Brief

> You are expected to produce a creative piece of work using the p5.js framework within a given set of constraints specified below. Beyond these constraints, you are free to include any other p5.js or JavaScript techniques, functions, or libraries to realize your creative vision.

### Technical constraints

> The following must be incorporated into your project:
>
> 1. An array.
> 2. A ‘While’ or ‘For’ Loop.
> 3. A conditional statement (<, >, ==, >=, <=).
> 4. A custom function (i.e. one you have written).
> 5. Use of p5.js’ random() and/or map().
> 6. Utilize the Weather API and make use of at least two live data values.
> 7. Incorporate a GUI element (i.e. button or a slider) OR make use of an event (i.e. keyboard, mouse - see p5js.org/reference).

## Constraints

### 1. An Array

I am using the `weekday` array to store the 7 different strings for the days of the week.

```javascript
const weekday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
```

### 2. A ‘While’ or ‘For’ Loop.

This for loop simply iterates through all the meshes being imported, using `String.prototype.includes()` to filter them.

```javascript
for (let i = 0; i < meshes.length; i++) {
  console.log(meshes[i].name);
  if (meshes[i].name.includes('Speed')) {
    windSpeedMesh = meshes[i];
    meshes[i].rotation = new BABYLON.Vector3.Zero();
  } else if (meshes[i].name.includes('Direction')) {
    windDirectionMesh = meshes[i];
    meshes[i].rotation = new BABYLON.Vector3.Zero();
  }
}
```

### 3. A conditional statement (<, >, ==, >=, <=).

Using a conditional statement to only update the `windSpeedMesh` rotation

```javascript
if (windSpeedMesh) windSpeedMesh.rotation.y += windSpeed / engine.getFps();
```

### 4. A custom function (i.e. one you have written).

Using the OSM (Open Street Map) API to retrieve the latitude and longitude vales for the the queried location, then passing that data through to the `getWeather()` function.

```javascript
const getLonLat = (query) => {
  let location;
  if (query) {
    const req = new XMLHttpRequest();
    req.addEventListener('load', (e) => {
      location = {
        lat: JSON.parse(e.target.responseText)[0].lat,
        lon: JSON.parse(e.target.responseText)[0].lon,
        name: JSON.parse(e.target.responseText)[0].display_name,
      };
      getWeather(location);
    });
    req.open(
      'GET',
      'https://nominatim.openstreetmap.org/search?q=' +
        String(query) +
        '&format=json'
    );
    req.send();
  } else {
    const req = new XMLHttpRequest();
    req.addEventListener('load', (e) => {
      location = {
        lat: JSON.parse(e.target.responseText)[0].lat,
        lon: JSON.parse(e.target.responseText)[0].lon,
        name: JSON.parse(e.target.responseText)[0].display_name,
      };
      getWeather(location);
    });
    req.open(
      'GET',
      'https://nominatim.openstreetmap.org/search?city=london&format=json'
    );
    req.send();
  }
};
```

### 5. Use of p5.js’ random() and/or map().

This code snippet is used to log a random number every 10 minutes

```javascript
setInterval(() => {
  console.log('Random Number: ' + random(0, 100));
}, 600000);
```

### 6. Utilize the Weather API and make use of at least two live data values.

This function is used to send a GET request to the weather API and parse the response data to another object.

```javascript
const getWeather = (location) => {
  let url =
    'https://api.open-meteo.com/v1/forecast?latitude=' +
    location.lat +
    '&longitude=' +
    location.lon +
    '&hourly=temperature_2m,relativehumidity_2m,rain,windspeed_10m,winddirection_10m,windgusts_10m,surface_pressure&windspeed_unit=ms&timezone=auto';
  let currentTime = new Date();
  const req = new XMLHttpRequest();
  req.addEventListener('load', (e) => {
    weather = JSON.parse(e.target.responseText);
    // console.log(weather.hourly);
    currentWeatherData.temp =
      weather.hourly.temperature_2m[currentTime.getHours()];
    currentWeatherData.relHum =
      weather.hourly.relativehumidity_2m[currentTime.getHours()];
    currentWeatherData.rain = weather.hourly.rain[currentTime.getHours()];
    currentWeatherData.windSpeed =
      weather.hourly.windspeed_10m[currentTime.getHours()];
    currentWeatherData.windDir =
      weather.hourly.winddirection_10m[currentTime.getHours()];
    currentWeatherData.windGusts =
      weather.hourly.windgusts_10m[currentTime.getHours()].toFixed(2);
    currentWeatherData.windAverage = (
      weather.hourly.windgusts_10m.reduce((a, b) => a + b, 0) /
      weather.hourly.windgusts_10m.length
    ).toFixed(2);
    currentWeatherData.pressure =
      weather.hourly.surface_pressure[currentTime.getHours()];
    currentWeatherData.location = location;

    console.log(currentWeatherData);

    windSpeed = currentWeatherData.windSpeed;

    updatePanel();
  });
  req.open('GET', url);
  req.send();
};
```

### 7. Incorporate a GUI element (i.e. button or a slider) OR make use of an event (i.e. keyboard, mouse - see p5js.org/

This input and button are simply used to allow the user to query any location and update all the data.

```html
<input
  id="locInput"
  type="text"
  placeholder="Enter location..."
  onsubmit="locSearch()"
/>
<button id="locSearchBTN">Search</button>
```
