import React from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import { CalcitePanel } from "@esri/calcite-components-react";

export const DayLightPanel = () => {
  return (
    <CalcitePanel height-scale="l" data-panel-id="daylight" hidden>
      <div id="daylight-container"></div>
    </CalcitePanel>
  );
};
