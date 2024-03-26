import Locate from "@arcgis/core/widgets/Locate.js";
import SceneView from "@arcgis/core/views/SceneView.js";

export const setupLocate = (view: SceneView) => {
  return new Locate({
    view,
  });
};
