import Measurement from "@arcgis/core/widgets/Measurement.js";
import SceneView from "@arcgis/core/views/SceneView.js";

export const setupMeasurement = (view: SceneView) => {
  return new Measurement({
    view,
    container: "measurement-container",
  });
};
