import React from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import { CalcitePanel } from "@esri/calcite-components-react";

export const ElevationProfilePanel = () => {
  return (
    <CalcitePanel
      heading="Elevation profile"
      height-scale="l"
      data-panel-id="elevationProfile"
      hidden
    >
      <div id="elevation-profile-container"></div>
    </CalcitePanel>
  );
};
