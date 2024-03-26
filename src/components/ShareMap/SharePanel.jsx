import React from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import { CalcitePanel } from "@esri/calcite-components-react";

export const SharePanel = () => {
  return (
    <>
          <CalcitePanel
            height-scale="l"
            data-panel-id="share"
            hidden
            closed
          ></CalcitePanel>
    </>
  );
};
