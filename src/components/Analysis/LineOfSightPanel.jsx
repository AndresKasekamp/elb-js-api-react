import React from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import { CalcitePanel } from "@esri/calcite-components-react";

export const LineOfSightPanel = () => {
  return (
    <>
      <CalcitePanel
        heading="Line of Sight"
        height-scale="l"
        data-panel-id="lineOfSight"
        hidden
      >
        <div id="line-of-sight-container"></div>
      </CalcitePanel>
    </>
  );
};

{
  /* <CalciteLabel>
  Start coordinates
  <form id="losForm">
    <CalciteInputText
      id="xLOSstart"
      name="xLOSstart"
      prefix-text="X-coordinate"
      value=""
    ></CalciteInputText>
    <CalciteInputText
      id="yLOSstart"
      name="yLOSstart"
      prefix-text="Y-coordinate"
      value=""
    ></CalciteInputText>
    <CalciteInputText
      id="zLoSstart"
      name="zLOSstart"
      prefix-text="Z-coordinate"
      value=""
    ></CalciteInputText>
  </form>
  <CalciteButton
    form="losForm"
    id="LoSstartBtn"
    name="LoSstartBtn"
    width="half"
  >
    Submit
  </CalciteButton>
</CalciteLabel> */
}
