import WebScene from "@arcgis/core/WebScene.js";
import SceneView from "@arcgis/core/views/SceneView.js";
import Layer from "@arcgis/core/layers/Layer.js";

export const setupWebScene = (id: string, ...layers: Layer[]) => {
  return new WebScene({
    portalItem: {
      id,
    },
    layers: [...layers],
  });
};

export const setupWebView = (map: WebScene, container: HTMLDivElement) => {
  return new SceneView({
    map,
    container,
    qualityProfile: "high",
  });
};
