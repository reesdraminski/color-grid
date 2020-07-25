# color-grid
A JavaScript library that creates a colorful moving mosaic background image.

## Configuration
```js
new ColorGrid({
  // required: DOM selector string
  selector: "body",
  // required: hex, rgb, rgba color strings
  colors: [
    "#5aca7d",
    "#74b889",
    "#8cd7a5"
  ],
  // default: .85, float between [0, 1] because it's a percentage
  coverage: 1,
  // default: 1, transition time in seconds
  smoothness: 2,
  // default: 10
  horizontalSquares: 20,
  // default: 10
  verticalSquares: 20,
  // default: 2000 (in ms)
  updateInterval: 3000
});
```

## People Using color-grid
* [Watersheets](https://watersheets.app)
