import React, { useState } from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import "@esri/calcite-components/dist/components/calcite-action.js";
import { CalcitePanel, CalciteAction } from "@esri/calcite-components-react";

export const MeasurementPanel = ({ measurement }) => {
  const [activeTool, setActiveTool] = useState("no-tool");

  const handleMeasurement = (tool) => {
    console.log("Measuremnt for tool", tool);
    setActiveTool(tool);
    measurement.activeTool = tool;
  };

  const clearMeasurement = () => {
    setActiveTool("no-tool");
    measurement.clear();
  };

  return (
    <>
      <CalcitePanel
        heading="Measurements"
        width-scale="s"
        height-scale="l"
        data-panel-id="measurement"
        hidden
      >
        <CalciteAction
          id="distanceButton"
          icon="measure-line"
          text="Measure line"
          active={activeTool === "direct-line" ? true : undefined}
          onClick={() => handleMeasurement("direct-line")}
          text-enabled
        ></CalciteAction>
        <CalciteAction
          id="areaButton"
          icon="measure-area"
          text="Measure area"
          active={activeTool === "area" ? true : undefined}
          onClick={() => handleMeasurement("area")}
          text-enabled
        ></CalciteAction>
        <CalciteAction
          id="clearButton"
          icon="trash"
          text="Clear"
          onClick={clearMeasurement}
          text-enabled
        ></CalciteAction>
        <div id="measurement-container"></div>
      </CalcitePanel>
    </>
  );
};
