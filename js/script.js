// Pull & Parse current weather from API

let weather;

// function setup() {
//   let currentTime = new Date();
//   url =
//     'https://api.open-meteo.com/v1/forecast?latitude=51.51&longitude=-0.13&hourly=temperature_2m,relativehumidity_2m,rain,windspeed_10m,winddirection_10m,windgusts_10m&windspeed_unit=ms&timezone=Europe%2FLondon';
//   loadJSON(url, (json) => {
//     weather = json;
//     console.log(weather.hourly);
//     currentWeatherData.temp =
//       weather.hourly.temperature_2m[currentTime.getHours()];
//     currentWeatherData.relHum =
//       weather.hourly.relativehumidity_2m[currentTime.getHours()];
//     currentWeatherData.rain = weather.hourly.rain[currentTime.getHours()];
//     currentWeatherData.windSpeed =
//       weather.hourly.windspeed_10m[currentTime.getHours()];
//     currentWeatherData.windDir =
//       weather.hourly.winddirection_10m[currentTime.getHours()];
//     currentWeatherData.windGusts =
//       weather.hourly.windgusts_10m[currentTime.getHours()];
//     currentWeatherData.windAverage = (
//       weather.hourly.windgusts_10m.reduce((a, b) => a + b, 0) /
//       weather.hourly.windgusts_10m.length
//     ).toFixed(2);

//     console.log(currentWeatherData);

//     windSpeed = currentWeatherData.windSpeed;

//     updatePanel();
//   });
// }

let currentWeatherData = {
  temp: 0,
  relHum: 0,
  rain: 0,
  windDir: 0,
  windGusts: 0,
  windSpeed: 0,
  windAverage: 0,
  location: {},
};

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

const getWeather = (location) => {
  let url =
    'https://api.open-meteo.com/v1/forecast?latitude=' +
    location.lat +
    '&longitude=' +
    location.lon +
    '&hourly=temperature_2m,relativehumidity_2m,rain,windspeed_10m,winddirection_10m,windgusts_10m&windspeed_unit=ms&timezone=auto';
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
    currentWeatherData.location = location;

    console.log(currentWeatherData);

    windSpeed = currentWeatherData.windSpeed;

    updatePanel();
  });
  req.open('GET', url);
  req.send();
};

getLonLat('oxford');

const updatePanel = () => {
  let tempOutdoorDeg = document.getElementById('tempOD');
  let tempOutdoorRh = document.getElementById('tempOR');
  let locLat = document.getElementById('locLat');
  let locLon = document.getElementById('locLon');
  let windDirDial = document.getElementById('Dial');
  let windGust = document.getElementById('windGust');
  let windAverage = document.getElementById('windAverage');
  let locDispName = document.getElementById('locDispName');

  tempOutdoorDeg.innerHTML = currentWeatherData.temp;
  tempOutdoorRh.innerHTML = currentWeatherData.relHum;
  windDirDial.setAttribute(
    'transform',
    'rotate(' + currentWeatherData.windDir + ')'
  );
  windGust.innerHTML = currentWeatherData.windGusts;
  windAverage.innerHTML = currentWeatherData.windAverage;
  locDispName.innerHTML = currentWeatherData.location.name;
  locLat.innerHTML = Number(currentWeatherData.location.lat).toFixed(2);
  locLon.innerHTML = Number(currentWeatherData.location.lon).toFixed(2);
};

document.getElementById('locSearchBTN', (e) => {
  // e.preventDefault();
  console.log(e);
});

// Variables

let windSpeed = 0; // m/s
let windDirection = 60; // deg
let rainAmount = 30; // mm (of the preceding hour)

let windSpeedRot = 0;

let windSpeedMesh, windDirectionMesh;

const modelName = 'model.gltf';

const canvas = document.getElementById('mainCanvas');
const engine = new BABYLON.Engine(canvas, true);

function createScene() {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.73, 0.89, 0.96);

  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    Math.PI / 2.5,
    1,
    new BABYLON.Vector3(15, 7, 3),
    scene
  );
  camera.setTarget(new BABYLON.Vector3(0, 2, 0));
  camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius;
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  var gl = new BABYLON.GlowLayer('glow', scene);
  gl.intensity = 1.5;

  BABYLON.SceneLoader.ImportMesh(
    '',
    '../models/',
    modelName,
    scene,
    (meshes) => {
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
      document.getElementById('fadeOutContainer').style.opacity = 0;
      setTimeout(function () {
        document.getElementById('fadeOutContainer').remove();
      }, 1000);
    }
  );

  if (window.matchMedia('(max-width: 700px)').matches) {
    camera.detachControl();
  }

  return scene;
}

const scene = createScene();

const rainParticleSystem = new BABYLON.ParticleSystem('rain', 100, scene);

rainParticleSystem.particleTexture = new BABYLON.Texture(
  '../models/tempRainImage.jpg'
);

var boxEmitter = rainParticleSystem.createBoxEmitter(
  new BABYLON.Vector3(0, 0, 0),
  new BABYLON.Vector3(0, 0, 0),
  new BABYLON.Vector3(-10, 10, -10),
  new BABYLON.Vector3(10, 10, 10)
);

// rainParticleSystem.emitter = new BABYLON.Vector3(0, 10, 0);
rainParticleSystem.gravity = new BABYLON.Vector3(0, -109.81, 0);
rainParticleSystem.emitRate = 1000;
rainParticleSystem.minLifeTime = 0.3;
rainParticleSystem.maxLifeTime = 2.5;

// rainParticleSystem.start();

scene.registerBeforeRender(() => {
  windSpeedMesh
    ? (windSpeedMesh.rotation.y += windSpeed / engine.getFps())
    : null;

  windDirectionMesh
    ? (windDirectionMesh.rotation.y = windDirection * (Math.PI / 180))
    : null;
});

engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener('resize', function () {
  engine.resize();
});
