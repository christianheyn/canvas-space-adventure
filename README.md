# Canvas Space Adventure

### Create Stars with canvas in a given box.

To install the demo:
```
$ git clone https://github.com/christianheyn/canvas-space-adventure.git
$ npm install
$ grunt build
```

#### Installation on your site
To init the stars on your site include the script ``js/partials/canvas-space-adventure.js`` and give a DOM-element as your galaxy in the parameter-list.
```
var myGalaxy = document.getElementById('my-galaxy'),
    space = new FuckingSpaceAdventure({
        galaxy: myGalaxy,// the element were the adventure begins
        numberOfStars: 1000,// how much stars you want to explore?
        maxStarRadius: 1.5,// how big are the stars?
        meteoroidWaiting: 400,// time between meteoroids
        meteoroidDuration: 15// meteoroid-speed
    });
```

### space.render()
To start or stop the canvas-rendering use the following:
```js
space.render(true);// start rendering
```
```js
space.render(false);// stop rendering
```
### space.resize()
Use the resize-method to fit the canvas(and your space adventure) to the galaxy-element.
```js
space.resize();
```

### space.meteoroid()
You can't wait for a meteoroid? Use the following:
```js
space.meteoroid();
```