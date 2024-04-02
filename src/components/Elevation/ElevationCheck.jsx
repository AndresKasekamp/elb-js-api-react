import React, { useState, useEffect } from "react";

import "@esri/calcite-components/dist/components/calcite-label.js";
import "@esri/calcite-components/dist/components/calcite-checkbox.js";
import { CalciteCheckbox, CalciteLabel } from "@esri/calcite-components-react";

// TODO kõrgusmudeli visibility ja state jagamine selgeks teha ja normaalselt kommunikeerida (array errorid, miks?)
export const ElevationCheck = ({ view, elevationOnOff }) => {
  const [elevation, setElevation] = useState(true);

  useEffect(() => {
    // Update state only if the prop changes
    setElevation(elevationOnOff);
  }, [elevationOnOff]);

  // TODO sa peaksid teadma, milline elevation on praegune lahtine
  const handleElevationCheck = () => {

    if (elevation) {
      setElevation(undefined);
    } else {
      setElevation(true);
    }
    view.map.ground.layers.forEach((layer) => {
      if (elevation) {
        layer.visible = true;
      } else {
        layer.visible = false;
      }
    });
  };

  return (
    <CalciteLabel layout="inline">
      <CalciteCheckbox
        id="elevationInput"
        key="elevation"
        onCalciteCheckboxChange={handleElevationCheck}
        checked={elevation}
      ></CalciteCheckbox>
      Elevation
    </CalciteLabel>
  );
};
