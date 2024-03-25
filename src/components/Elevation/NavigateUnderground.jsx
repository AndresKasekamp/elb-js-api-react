import React, { useState } from "react";

import "@esri/calcite-components/dist/components/calcite-label.js";
import "@esri/calcite-components/dist/components/calcite-checkbox.js";
import { CalciteCheckbox, CalciteLabel } from "@esri/calcite-components-react";

export const NavigateUnderground = ({ view }) => {
  const [underground, setUnderground] = useState(false);

  const handleNavigationUndergroundChange = () => {
    setUnderground(!underground);
    view.map.ground.navigationConstraint.type = underground
      ? "stay-above"
      : "none";
  };

  return (
    <>
      <CalciteLabel layout="inline">
        <CalciteCheckbox
          id="navigationUnderground"
          key="navigationUnderground"
          onCalciteCheckboxChange={handleNavigationUndergroundChange}
          checked={underground}
        ></CalciteCheckbox>
        Navigate underground
      </CalciteLabel>
    </>
  );
};
