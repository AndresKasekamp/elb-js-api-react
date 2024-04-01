import React from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import { CalcitePanel } from "@esri/calcite-components-react";

export const SketchingPanel = () => {
  return (
    <CalcitePanel
      heading="Sketching"
      height-scale="l"
      data-panel-id="sketching"
      hidden
    >
      <div id="sketchPanel" className="esri-widget">
        <div id="startbuttons">
          <button
            id="point"
            data-type="point"
            className="esri-button starttool"
          >
            Draw a point of interest
          </button>
          <button
            id="line"
            data-type="polyline"
            className="esri-button starttool"
          >
            Draw a route
          </button>
          <button
            id="extrudedPolygon"
            data-type="polygon"
            className="esri-button starttool"
          >
            Draw a building
          </button>
        </div>
        <div id="actionbuttons">
          <button id="cancel" className="esri-button">
            Cancel
          </button>
          <button id="done" className="esri-button">
            Done
          </button>
        </div>

        <div id="edgeoperationbuttons">
          <div id="extrudeSliderContainer">
            <div>
              Extrude value: <span id="extrude">10</span>
            </div>
            <div id="extrudeSlider"></div>
          </div>
          <br />
          Select the edge operation:
          <div className="update-options" id="edge">
            <button
              className="esri-widget--button edge-button"
              id="none-edge-button"
              value="none"
            >
              None
            </button>
            <button
              className="esri-widget--button edge-button edge-button-selected"
              id="split-edge-button"
              value="split"
            >
              Split
            </button>
            <button
              className="esri-widget--button edge-button"
              id="offset-edge-button"
              value="offset"
            >
              Offset
            </button>
          </div>
          Select the move operation:
          <div className="update-options" id="shape">
            <button
              className="esri-widget--button shape-button"
              id="none-shape-button"
              value="none"
            >
              None
            </button>
            <button
              className="esri-widget--button shape-button shape-button-selected"
              id="move-shape-button"
              value="move"
            >
              Move
            </button>
          </div>
        </div>
      </div>
    </CalcitePanel>
  );
};
