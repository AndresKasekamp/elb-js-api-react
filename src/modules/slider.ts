import Slider from "@arcgis/core/widgets/Slider.js";

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

export const setupSliderStyle = () => {
  const itemPanelDiv = document.createElement("div");
  const sliderDiv = document.createElement("calcite-slider");

  // Set attributes for the slider
  // @ts-expect-error - slider 
  sliderDiv.min = 0;
  // @ts-expect-error - slider 
  sliderDiv.max = 100;
  // @ts-expect-error - slider 
  sliderDiv.step = 1;
  // @ts-expect-error - slider 
  sliderDiv.value = 100;
  // @ts-expect-error - slider 
  sliderDiv.labelHandles = true;

  return [itemPanelDiv, sliderDiv];
};


