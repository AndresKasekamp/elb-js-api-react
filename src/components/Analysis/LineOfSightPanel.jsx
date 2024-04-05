import React, { useState, useEffect } from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import "@esri/calcite-components/dist/components/calcite-label.js";
import "@esri/calcite-components/dist/components/calcite-input-text.js";
import "@esri/calcite-components/dist/components/calcite-button.js";

import {
  CalcitePanel,
  CalciteLabel,
  CalciteInputText,
  CalciteButton,
} from "@esri/calcite-components-react";

import Point from "@arcgis/core/geometry/Point.js";

export const LineOfSightPanel = ({ losAnalysis }) => {
  const createTarget = (x, y, z = 0) => {
    return {
      location: new Point({
        x,
        y,
        z,
        spatialReference: { wkid: 3301 },
      }),
    };
  };

  const handleLosStartBtn = (e) => {
    e.preventDefault();
    const xLOSstartValue = document.getElementById("xLOSstart").value;
    const yLOSstartValue = document.getElementById("yLOSstart").value;
    const zLOSstartValue = document.getElementById("zLoSstart").value;

    const xLOSendValue = document.getElementById("xLOSend").value;
    const yLOSendValue = document.getElementById("yLOSend").value;
    const zLOSendValue = document.getElementById("zLoSend").value;

    // Generating new analysis
    const viewModel = losAnalysis.viewModel;

    viewModel.observer = new Point({
      x: xLOSstartValue,
      y: yLOSstartValue,
      z: zLOSstartValue,
      spatialReference: { wkid: 3301 },
    });

    viewModel.targets = [
      createTarget(xLOSendValue, yLOSendValue, zLOSendValue),
    ];

  };

  return (
    <CalcitePanel
      heading="Line of Sight"
      height-scale="l"
      data-panel-id="lineOfSight"
      hidden
    >
      <div id="line-of-sight-container"></div>

      <CalciteLabel>
        <h2>Create a line of sight analysis</h2>
        <form
          id="losForm"
          onSubmit={(e) => {
            handleLosStartBtn(e);
          }}
        >
          <h3>Start coordinates</h3>
          <CalciteInputText
            id="xLOSstart"
            name="xLOSstart"
            prefix-text="X"
            required
            value=""
          ></CalciteInputText>
          <CalciteInputText
            id="yLOSstart"
            name="yLOSstart"
            prefix-text="Y"
            required
            value=""
          ></CalciteInputText>
          <CalciteInputText
            id="zLoSstart"
            name="zLOSstart"
            prefix-text="Z"
            required
            value=""
          ></CalciteInputText>

          <h3>Target coordinates</h3>
          <CalciteInputText
            id="xLOSend"
            name="xLOSend"
            prefix-text="X"
            required
            value=""
          ></CalciteInputText>
          <CalciteInputText
            id="yLOSend"
            name="yLOSend"
            prefix-text="Y"
            required
            value=""
          ></CalciteInputText>
          <CalciteInputText
            id="zLoSend"
            name="zLoSend"
            prefix-text="Z"
            required
            value=""
          ></CalciteInputText>
          <br />
          <CalciteButton
            form="losForm"
            id="LoSstartBtn"
            name="LoSstartBtn"
            type="submit"
            width="half"
          >
            Submit
          </CalciteButton>
        </form>
      </CalciteLabel>
    </CalcitePanel>
  );
};
