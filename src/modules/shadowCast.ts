import ShadowCast from "@arcgis/core/widgets/ShadowCast.js";
import SceneView from "@arcgis/core/views/SceneView.js";

export const setupShadowCast = (view: SceneView) => {
  return new ShadowCast({
    view,
    visible: false,
    container: "shadowcast-container",
  });
};
