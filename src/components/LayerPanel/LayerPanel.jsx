import React from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import { CalcitePanel } from "@esri/calcite-components-react";

export const LayerPanel = ({ heading, dataPanelId, divId }) => {
  return (
    <CalcitePanel
      heading={heading}
      height-scale="l"
      data-panel-id={dataPanelId}
      hidden
    >
      <div id={divId}></div>
    </CalcitePanel>
  );
};
