import ElevationLayer from "@arcgis/core/layers/ElevationLayer.js";

export const setupElevationLayer = (url: string, title: string) => {
  return new ElevationLayer({
    url,
    title,
    visible: false,
  });
};
