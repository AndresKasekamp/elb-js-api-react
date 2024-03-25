import React, { useState } from "react";

import "@esri/calcite-components/dist/components/calcite-checkbox.js";
import "@esri/calcite-components/dist/components/calcite-label.js";

import { CalciteCheckbox, CalciteLabel } from "@esri/calcite-components-react";

export const BasemapSwitch = ({ basemaps, view }) => {
  const [noBasemap, setNoBasemap] = useState(false);

  const handleCheckboxChange = () => {
    setNoBasemap(!noBasemap);
    if (!noBasemap) {
      // Save the current basemap when switching to 'No basemap'
      basemaps.currentBasemap = view.map.basemap;
      view.map.basemap = {};
    } else {
      // Restore the saved basemap when unchecking 'No basemap'
      view.map.basemap = basemaps.currentBasemap;
    }
  };

  return (
    <>
      <CalciteLabel layout="inline">
        <CalciteCheckbox
          id="basemapSwitch"
          scale="l"
          onCalciteCheckboxChange={handleCheckboxChange}
        ></CalciteCheckbox>
        No basemap
      </CalciteLabel>
    </>
  );
};

