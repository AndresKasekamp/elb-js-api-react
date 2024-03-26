import React from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import { CalcitePanel } from "@esri/calcite-components-react";
import { ElevationRadioButtons } from "./ElevationRadioButtons";
import { NavigateUnderground } from "./NavigateUnderground";
import { ElevationCheck } from "./ElevationCheck";

export const ElevationGalleryPanel = ({ view, navigationUndergroundButton, checkedElevation }) => {
  return (
    <>
      <CalcitePanel
        heading="Elevation settings"
        height-scale="l"
        data-panel-id="elevation"
        hidden
      >
        <ElevationRadioButtons view={view} checkedElevation={checkedElevation} />
        <NavigateUnderground view={view} navigationUndergroundButton={navigationUndergroundButton} />
        <ElevationCheck view={view} />
      </CalcitePanel>
    </>
  );
};

{
  /* <CalcitePanel
heading="Elevation settings"
height-scale="l"
data-panel-id="elevation"
hidden
>
<CalciteRadioButtonGroup
  id="elevationModels"
  name="ElevationModels"
  layout="vertical"
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

<CalciteLabel layout="inline">
  <CalciteCheckbox
    id="navigationUnderground"
    checked
  ></CalciteCheckbox>
  Navigate underground
</CalciteLabel>

<CalciteLabel layout="inline">
  <CalciteCheckbox id="elevationInput" checked></CalciteCheckbox>
  Elevation
</CalciteLabel>
</CalcitePanel> */
}
