import Legend from "@arcgis/core/widgets/Legend.js";

const setupLegend = (view, layer, div) => {
  return new Legend({
    view: view,
    layerInfos: [
      {
        layer: layer,
      },
    ],
    container: div,
  });
};

const setupLegendStyle = () => {
  const legendDiv = document.createElement("div");
  legendDiv.classList.add("esri-widget");
  return legendDiv;
};

export { setupLegend, setupLegendStyle };
