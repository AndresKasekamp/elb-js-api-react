import Slider from "@arcgis/core/widgets/Slider.js";
import LayerListItem from "@arcgis/core/widgets/LayerList/ListItem.js";

export const setupSlider = (container: HTMLDivElement, labels: boolean) => {
  return new Slider({
    min: 0,
    max: 1,
    precision: 2,
    values: [1],
    visibleElements: {
      labels,
      rangeLabels: true,
    },
    container,
  });
};

export const setupSliderStyle = (item: LayerListItem) => {
  const itemPanelDiv = document.createElement("div");
  const sliderDiv = document.createElement("calcite-slider");

  // Set attributes for the slider
  sliderDiv.setAttribute("min", "0");
  sliderDiv.setAttribute("max", "100");
  sliderDiv.setAttribute("step", "1");
  sliderDiv.setAttribute("value", "100");
  sliderDiv.setAttribute("label-handles", "true");

  sliderDiv.addEventListener("calciteSliderInput", () => {
    // @ts-expect-error - value fix to be done
    const value = sliderDiv.value / 100;
    item.layer.opacity = value;
  });

  return [itemPanelDiv, sliderDiv];
};


