import { Circle, Fill, Stroke, Style } from "ol/style.js";

const rainbow = [
  "#e61919",
  "#e68019",
  "#e6e619",
  "#80e619",
  "#19e619",
  "#19e680",
  "#19e6e6",
  "#1980e6",
  "#1919e6",
  "#8019e6",
  "#e619e6",
  "#e61980",
];
const availableColors = [...rainbow];
export const getUniqueColor = () => {
  // if (availableColors.length === 0) {
  //   availableColors = [...rainbow]; // Reset if all colors are used
  // }
  return availableColors.splice(
    Math.floor(Math.random() * availableColors.length),
    1,
  )[0];
};
export const createProvinceStyle = (color: string) =>
  new Style({
    fill: new Fill({
      color,
    }),
    stroke: new Stroke({
      color: "#000000",
      width: 3,
    }),
  });

export const stationStyle = new Style({
  image: new Circle({
    fill: new Fill({
      color: "#ffc917",
    }),
    radius: 3,
  }),
});
