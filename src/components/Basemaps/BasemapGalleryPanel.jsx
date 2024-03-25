import React from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import { CalcitePanel } from "@esri/calcite-components-react";

import { BasemapSwitch } from "./BasemapSwitch";
import { BasemapSlider } from "./BasemapSlider";

export const BasemapGalleryPanel = ({ basemaps, view }) => {
  return (
    <>
      <CalcitePanel
        heading="Basemaps"
        height-scale="l"
        data-panel-id="basemaps"
        hidden
      >
        <div id="basemaps-container"></div>

        <BasemapSwitch basemaps={basemaps} view={view} />
        <BasemapSlider view={view} />
      </CalcitePanel>
    </>
  );
};
