import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion.js";
import Format from "@arcgis/core/widgets/CoordinateConversion/support/Format.js";
import Point from "@arcgis/core/geometry/Point.js";
import SceneView from "@arcgis/core/views/SceneView.js";

// eslint-disable-next-line no-useless-escape
const numberSearchPattern = /-?\d+[\.]?\d*/;

export const setupCoordinateWidget = (view: SceneView) => {
  return new CoordinateConversion({
    view,
  });
};

export const setupNewFormat = () => {
  return new Format({
    name: "XYZ",
    conversionInfo: {
      convert: function (point) {
        const returnPoint = point;
        const x = returnPoint.x.toFixed(2);
        const y = returnPoint.y.toFixed(2);
        const z = returnPoint.z.toFixed(2);
        return {
          location: returnPoint,
          coordinate: `${x}, ${y}, ${z}`,
        };
      },
      reverseConvert: function (string) {
        const parts = string.split(",");
        return new Point({
          x: parseFloat(parts[0]),
          y: parseFloat(parts[1]),
          z: parseFloat(parts[2]),
          spatialReference: { wkid: 3301 },
        });
      },
    },
    coordinateSegments: [
      {
        alias: "X",
        description: "Longitude",
        searchPattern: numberSearchPattern,
      },
      {
        alias: "Y",
        description: "Latitude",
        searchPattern: numberSearchPattern,
      },
      {
        alias: "Z",
        description: "Elevation",
        searchPattern: numberSearchPattern,
      },
    ],
    defaultPattern: "X, Y, Z",
  });
};


