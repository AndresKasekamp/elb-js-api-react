import Slice from "@arcgis/core/widgets/Slice.js";
import SceneView from "@arcgis/core/views/SceneView.js";

export const setupSlice = (view: SceneView) => {
  return new Slice({
    view: view,
    container: "slicing-container",
  });
};

