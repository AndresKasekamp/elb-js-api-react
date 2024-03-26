import Daylight from "@arcgis/core/widgets/Daylight.js";
import SceneView from "@arcgis/core/views/SceneView.js";

export const setupDaylight = (view: SceneView) => {
  return new Daylight({
    view,
    visible: true,
    container: "daylight-container",
  });
};
