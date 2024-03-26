import React from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import { CalcitePanel } from "@esri/calcite-components-react";

export const SlicingPanel = () => {
  return (
    <>
      <CalcitePanel
        heading="Slicing"
        height-scale="l"
        data-panel-id="slicing"
        hidden
      >
        <div id="slicing-container"></div>
      </CalcitePanel>
    </>
  );
};
