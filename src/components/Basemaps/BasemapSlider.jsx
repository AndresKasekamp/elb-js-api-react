import React, { useState } from "react";

import "@esri/calcite-components/dist/components/calcite-slider.js";
import { CalciteSlider } from "@esri/calcite-components-react";

export const BasemapSlider = ({ view }) => {
  const [sliderValue, setSliderValue] = useState(100);

  const handleOpacityChange = (event) => {
    const newValue = event.target.value;
    setSliderValue(newValue);
    view.map.ground.opacity = newValue / 100;
  };

  return (
    <>
      <CalciteSlider
        id="opacitySlider"
        label-handles
        min={0}
        max={100}
        step={1}
        value={sliderValue}
        onCalciteSliderInput={handleOpacityChange}
      ></CalciteSlider>
    </>
  );
};
