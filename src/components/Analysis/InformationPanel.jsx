import React from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import { CalcitePanel } from "@esri/calcite-components-react";

export const InformationPanel = ({description}) => {
  return (
    <>
      <CalcitePanel
        id="information-panel"
        heading="Details"
        data-panel-id="information"
        hidden
      >
        <div id="info-content">
          <div id="item-description">{description}</div>
        </div>
      </CalcitePanel>
    </>
  );
};
