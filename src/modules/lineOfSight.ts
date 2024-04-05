import LineOfSight from "@arcgis/core/widgets/LineOfSight.js";
import SceneView from "@arcgis/core/views/SceneView.js";

export const setupLoS = (view: SceneView) => {
  return new LineOfSight({
    view,
    container: "line-of-sight-container",
  });
};



