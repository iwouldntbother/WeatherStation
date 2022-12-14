// Pull & Parse current weather from API

let weather;

// Create global weather data object structure
let currentWeatherData = {
  temp: 0,
  relHum: 0,
  rain: 0,
  windDir: 0,
  windGusts: 0,
  windSpeed: 0,
  windAverage: 0,
  pressure: 0,
  location: {},
};

// Use a get request to OSM to grab the lat and lon values of either a specific location or default to London
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

// Get the weather data from Open Meteo, parse and distrobute into the previously declared object
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

// Update the DOM with the new weather data
const updatePanel = () => {
  let tempOutdoorDeg = document.getElementById('tempOD');
  let tempOutdoorRh = document.getElementById('tempOR');
  let locLat = document.getElementById('locLat');
  let locLon = document.getElementById('locLon');
  let windDirDial = document.getElementById('Dial');
  let windGust = document.getElementById('windGust');
  let windAverage = document.getElementById('windAverage');
  let locDispName = document.getElementById('locDispName');
  let dispPressure = document.getElementById('dispPressure');
  let dispRain = document.getElementById('dispRain');

  tempOutdoorDeg.innerHTML = currentWeatherData.temp;
  tempOutdoorRh.innerHTML = currentWeatherData.relHum;
  windDirDial.setAttribute(
    'transform',
    'rotate(' + currentWeatherData.windDir + ')'
  );
  windDirection = currentWeatherData.windDir;
  windGust.innerHTML = currentWeatherData.windGusts;
  windAverage.innerHTML = currentWeatherData.windAverage;
  locDispName.innerHTML = currentWeatherData.location.name;
  locLat.innerHTML = Number(currentWeatherData.location.lat).toFixed(2);
  locLon.innerHTML = Number(currentWeatherData.location.lon).toFixed(2);
  dispPressure.innerHTML = currentWeatherData.pressure.toFixed(2);
  dispRain.innerHTML = currentWeatherData.rain;
};

// function to start the weather data update process using the loaction query from the DOM input
const locSearch = () => {
  let value = document.getElementById('locInput').value;
  getLonLat(value || 'london');
  // document.getElementById('locInput').value = '';
};

// Detect the enter button clicked when typing in the input field
document.getElementById('locInput').addEventListener('keyup', (e) => {
  if (e.key === 'Enter') locSearch();
});

// Detect the serach button being pressed
document.getElementById('locSearchBTN').addEventListener('click', () => {
  if (document.getElementById('locInput').value) locSearch();
});

//  Get date and time
const weekday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const getDateTime = () => {
  let date = '';
  let time = '';
  let day = '';
  let dateData = new Date();
  date =
    dateData.getDate() +
    '.' +
    dateData.getMonth() +
    '.' +
    String(dateData.getFullYear()).slice(-2);

  time = dateData.getHours() + ':' + ('00' + dateData.getMinutes()).slice(-2);
  day = weekday[dateData.getDay()];
  document.getElementById('dispDate').innerHTML = date;
  document.getElementById('dispTime').innerHTML = time;
  document.getElementById('dispDay').innerHTML = day;
};

// Update clock every hour
setInterval(getDateTime, 60000);
getDateTime();

// Starting the inital data collection from the API
getLonLat();

// BABYLON.js Variables

let windSpeed = 0; // m/s
let windDirection = 60; // deg
let rainAmount = 30; // mm (of the preceding hour)

let windSpeedRot = 0;

let windSpeedMesh, windDirectionMesh;

const modelName = 'model.gltf';

// Creating the canvas and engine for BABYLON.js
const canvas = document.getElementById('mainCanvas');
const engine = new BABYLON.Engine(canvas, true);

// Init function for creating a scene and loading the model.
function createScene() {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.73, 0.89, 0.96);

  // Creating the camera
  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    Math.PI / 2.5,
    1,
    new BABYLON.Vector3(15, 7, 3),
    scene
  );
  camera.setTarget(new BABYLON.Vector3(0, 2, 0));
  camera.minZ = 0.1;
  camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius;
  camera.attachControl(canvas, true);

  // Creating a light for the scene
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Loading the model file into the scene
  BABYLON.SceneLoader.ImportMesh(
    '',
    '../models/',
    modelName,
    scene,
    (meshes) => {
      for (let i = 0; i < meshes.length; i++) {
        // Storing the meshs into a variables for later use
        if (meshes[i].name.includes('Speed')) {
          windSpeedMesh = meshes[i];
          meshes[i].rotation = new BABYLON.Vector3.Zero();
        } else if (meshes[i].name.includes('Direction')) {
          windDirectionMesh = meshes[i];
          meshes[i].rotation = new BABYLON.Vector3.Zero();
        }
      }
      // Hiding the cover div
      document.getElementById('fadeOutContainer').style.opacity = 0;
      setTimeout(function () {
        document.getElementById('fadeOutContainer').remove(); // Removing the div after its been hiden to avoid an issues
      }, 1000);
    }
  );

  return scene;
}

const scene = createScene(); // Storing the scene as a global variable for use later

// Creating a global particle system for the rain
const rainParticleSystem = new BABYLON.ParticleSystem('rain', 100, scene);

rainParticleSystem.particleTexture = new BABYLON.Texture('../models/rain.png');

var boxEmitter = rainParticleSystem.createBoxEmitter(
  new BABYLON.Vector3(0, 0, 0),
  new BABYLON.Vector3(0, 0, 0),
  new BABYLON.Vector3(-10, 10, -10),
  new BABYLON.Vector3(10, 10, 10)
);

rainParticleSystem.gravity = new BABYLON.Vector3(0, -109.81, 0);
rainParticleSystem.minSize = 0.5;
rainParticleSystem.maxSize = 0.5;
rainParticleSystem.minLifeTime = 0.3;
rainParticleSystem.maxLifeTime = 2.5;

// Animating the meshes and rain every frame
scene.registerBeforeRender(() => {
  if (windSpeedMesh) windSpeedMesh.rotation.y += windSpeed / engine.getFps();

  if (windDirectionMesh)
    windDirectionMesh.rotation.y = windDirection * (Math.PI / 180);

  if (rainParticleSystem && currentWeatherData.rain > 0) {
    rainParticleSystem.emitRate = currentWeatherData.rain * 10;
    rainParticleSystem.start();
  }
});

// Starting the render loop
engine.runRenderLoop(function () {
  scene.render();
});

// Resizing the canvas and scene when the window chnages size
window.addEventListener('resize', function () {
  engine.resize();
});

// I hadent used a random variable from p5.js so I added this :P
function setup() {
  setInterval(() => {
    console.log('Random Number: ' + random(0, 100));
  }, 600000);
}
