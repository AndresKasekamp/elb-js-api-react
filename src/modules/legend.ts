import Legend from "@arcgis/core/widgets/Legend.js";
import SceneView from "@arcgis/core/views/SceneView.js";
import Layer from "@arcgis/core/layers/Layer.js"

export const setupLegend = (view: SceneView, layer: Layer, container: HTMLDivElement) => {
  return new Legend({
    view: view,
    layerInfos: [
      {
        layer,
      },
    ],
    container,
  });
};

export const setupLegendStyle = () => {
  const legendDiv = document.createElement("div");
  legendDiv.classList.add("esri-widget");
  return legendDiv;
};


