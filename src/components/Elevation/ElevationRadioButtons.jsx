import React from "react";

import "@esri/calcite-components/dist/components/calcite-radio-button-group.js";
import "@esri/calcite-components/dist/components/calcite-radio-button.js";
import "@esri/calcite-components/dist/components/calcite-label.js";
import {
  CalciteRadioButtonGroup,
  CalciteRadioButton,
  CalciteLabel,
} from "@esri/calcite-components-react";

export const ElevationRadioButtons = ({ view }) => {
  const handleElevationChange = (e) => {
    const selectedItem = e.target.selectedItem.value;

    view.map.ground.layers.forEach((layer) => {
      layer.visible = layer.id === selectedItem;
    });
  };

  return (
    <>
      <CalciteRadioButtonGroup
        id="elevationModels"
        name="ElevationModels"
        layout="vertical"
        onCalciteRadioButtonGroupChange={handleElevationChange}
      >
        <CalciteLabel layout="inline">
          <CalciteRadioButton
            id="dtmElevation"
            value="987798be0faa561d"
            checked
          ></CalciteRadioButton>
          DTM
        </CalciteLabel>
        <CalciteLabel layout="inline">
          <CalciteRadioButton
            id="apElevation"
            value="bae50815bbab6ded"
          ></CalciteRadioButton>
          Aluspõhi 50m
        </CalciteLabel>
        <CalciteLabel layout="inline">
          <CalciteRadioButton
            id="akElevation"
            value="974102ce30be63bb"
          ></CalciteRadioButton>
          Aluskord 50m
        </CalciteLabel>
      </CalciteRadioButtonGroup>
    </>
  );
};
