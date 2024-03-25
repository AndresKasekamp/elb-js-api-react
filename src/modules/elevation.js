import ElevationLayer from "@arcgis/core/layers/ElevationLayer.js";

const elevationManipulation = (view) => {
  const opacitySlider = document.getElementById("opacitySlider");
  opacitySlider.addEventListener("calciteSliderInput", () => {
    const value = opacitySlider.value / 100;
    view.map.ground.opacity = value;
  });

  const navigateUndergroundInput = document.getElementById(
    "navigationUnderground"
  );

  const elevationInput = document.getElementById("elevationInput");

  navigateUndergroundInput.addEventListener(
    "calciteCheckboxChange",
    (event) => {
      view.map.ground.navigationConstraint.type = event.target.checked
        ? "none"
        : "stay-above";
    }
  );

  elevationInput.addEventListener("calciteCheckboxChange", updateElevation);

  function updateElevation(e) {
    view.map.ground.layers.forEach((layer) => {
      layer.visible = e.target.checked;
    });
  }

  const elevationLayerGroup = document.getElementById("elevationModels");

  elevationLayerGroup.addEventListener("calciteRadioButtonGroupChange", () => {
    const selectedItem = elevationLayerGroup.selectedItem.value;

    view.map.ground.layers.forEach((layer) => {
      layer.visible = layer.id === selectedItem;
    });
  });
};

const setupElevationLayer = (url, title) => {
  return new ElevationLayer({
    url,
    title,
    visible: false,
  });
};



export { elevationManipulation, setupElevationLayer };
