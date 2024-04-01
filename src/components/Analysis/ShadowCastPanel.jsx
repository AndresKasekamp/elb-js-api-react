import React from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import { CalcitePanel } from "@esri/calcite-components-react";

export const ShadowCastPanel = () => {
  return (
    <CalcitePanel height-scale="l" data-panel-id="shadowCast" hidden>
      <div id="shadowcast-container"></div>
    </CalcitePanel>
  );
};
