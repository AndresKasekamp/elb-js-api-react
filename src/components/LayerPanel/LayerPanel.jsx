import React, { useState } from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import "@esri/calcite-components/dist/components/calcite-button.js";
import { CalcitePanel, CalciteButton } from "@esri/calcite-components-react";
import { displayWindmills } from "../../modules/dev/rotatingWindmills.js";

// TODO natuke paddingut windmillidele

export const LayerPanel = ({ heading, dataPanelId, divId, view = null }) => {
  const [windmillDisplayed, setWindmillDisplayed] = useState(undefined);

  const checkWindmills = async () => {
    setWindmillDisplayed(true);
    console.log("Adding windmills");
    console.time("windmills");
    await displayWindmills(view);
    console.timeEnd("windmills");
  };

  return (
    <CalcitePanel
      heading={heading}
      height-scale="l"
      data-panel-id={dataPanelId}
      hidden
    >
      <div id={divId}></div>
      {view && (
        <CalciteButton
          label="Add windmills"
          disabled={windmillDisplayed}
          onClick={checkWindmills}
        >
          Lisa tuulikud
        </CalciteButton>
      )}
    </CalcitePanel>
  );
};
