import React from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import { CalcitePanel } from "@esri/calcite-components-react";
import { ElevationRadioButtons } from "./ElevationRadioButtons";
import { NavigateUnderground } from "./NavigateUnderground";
import { ElevationCheck } from "./ElevationCheck";

export const ElevationGalleryPanel = ({
  view,
  navigationUndergroundButton,
  checkedElevation,
  elevationOnOff
}) => {
  return (
    <CalcitePanel
      heading="Elevation settings"
      height-scale="l"
      data-panel-id="elevation"
      hidden
    >
      <ElevationRadioButtons view={view} checkedElevation={checkedElevation} />
      <NavigateUnderground
        view={view}
        navigationUndergroundButton={navigationUndergroundButton}
      />
      <ElevationCheck view={view} elevationOnOff={elevationOnOff} />
    </CalcitePanel>
  );
};
