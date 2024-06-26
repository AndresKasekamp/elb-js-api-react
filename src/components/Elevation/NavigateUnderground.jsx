import React, { useState, useEffect } from "react";

import "@esri/calcite-components/dist/components/calcite-label.js";
import "@esri/calcite-components/dist/components/calcite-checkbox.js";
import { CalciteCheckbox, CalciteLabel } from "@esri/calcite-components-react";

export const NavigateUnderground = ({ view, navigationUndergroundButton }) => {

  const [underground, setUnderground] = useState(undefined);

  useEffect(() => {
    // Update state only if the prop changes
    setUnderground(navigationUndergroundButton);
  }, [navigationUndergroundButton]);

  const handleNavigationUndergroundChange = () => {
    if (underground === true) {
      setUnderground(undefined);
    } else {
      setUnderground(true);
    }
    view.map.ground.navigationConstraint.type = underground
      ? "stay-above"
      : "none";
  };

  return (
    <CalciteLabel layout="inline">
      <CalciteCheckbox
        id="navigationUnderground"
        key="navigationUnderground"
        onCalciteCheckboxChange={handleNavigationUndergroundChange}
        checked={underground}
      ></CalciteCheckbox>
      Navigate underground
    </CalciteLabel>
  );
};


