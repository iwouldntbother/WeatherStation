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

The `meshes` object is an array

```javascript
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
};
```
