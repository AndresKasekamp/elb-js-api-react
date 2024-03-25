import React, { useState } from "react";

import "@esri/calcite-components/dist/components/calcite-label.js";
import "@esri/calcite-components/dist/components/calcite-checkbox.js";
import { CalciteCheckbox, CalciteLabel } from "@esri/calcite-components-react";

export const ElevationCheck = ({ view }) => {
  const [elevation, setElevation] = useState(true);

  const handleElevationCheck = () => {
    setElevation(!elevation);
    view.map.ground.layers.forEach((layer) => {
      layer.visible = elevation;
    });
  };

  return (
    <>
      <CalciteLabel layout="inline">
        <CalciteCheckbox
          id="elevationInput"
          key="elevation"
          onCalciteCheckboxChange={handleElevationCheck}
          checked={elevation}
        ></CalciteCheckbox>
        Elevation
      </CalciteLabel>
    </>
  );
};
