import React, { useState } from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import "@esri/calcite-components/dist/components/calcite-action.js";
import { CalcitePanel, CalciteAction } from "@esri/calcite-components-react";

export const MeasurementPanel = ({ measurement }) => {
  const [activeTool, setActiveTool] = useState(undefined);
  const [panelOpen, setPanelOpen] = useState(true);

  const handleMeasurement = (tool) => {
    setActiveTool(tool);
    measurement.activeTool = tool;
    setPanelOpen(undefined);
  };

  const clearMeasurement = () => {
    setActiveTool(undefined);
    measurement.clear();
    setPanelOpen(undefined);
  };

  return (
    <CalcitePanel
      heading="Measurements"
      width-scale="s"
      height-scale="l"
      data-panel-id="measurement"
      hidden={panelOpen}
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
  );
};
