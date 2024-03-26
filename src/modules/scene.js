import WebScene from "@arcgis/core/WebScene.js";
import SceneView from "@arcgis/core/views/SceneView.js";

// TODO vaata kas siin saaks lahtipakkimisega teha
const setupWebScene = (id, ...layers) => {
  return new WebScene({
    portalItem: {
      id,
    },
    layers: [...layers],
  });
};

const setupWebView = (map, container) => {
  return new SceneView({
    map,
    container,
    qualityProfile: "high",
  });
};

export { setupWebScene, setupWebView };
