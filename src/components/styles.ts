import { Circle, Fill, Stroke, Style } from "ol/style.js";

export const stationStyle = new Style({
  image: new Circle({
    fill: new Fill({
      color: "#ffc917",
    }),
    radius: 3,
  }),
});

export const provinceStyle = new Style({
  fill: new Fill({
    color: "#0063d3",
  }),
  stroke: new Stroke({
    color: "#003082",
    width: 3,
  }),
});
