import React, { useState } from "react";

import "@esri/calcite-components/dist/components/calcite-panel.js";
import "@esri/calcite-components/dist/components/calcite-button.js";
import "@esri/calcite-components/dist/components/calcite-label.js";
import "@esri/calcite-components/dist/components/calcite-switch.js";
import { CalcitePanel, CalciteButton, CalciteLabel, CalciteSwitch } from "@esri/calcite-components-react";
import { displayWindmills } from "../../modules/dev/rotatingWindmills.js";


// TODO natuke paddingut windmillidele

export const LayerPanel = ({ heading, dataPanelId, divId, view = null }) => {
  const [windmillDisplayed, setWindmillDisplayed] = useState(undefined);
  // const [windmillDisplayed, setWindmillDisplayed] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  const checkWindmills = async () => {

    setWindmillDisplayed(true);
    await displayWindmills(view);

    setPanelOpen(undefined);
  };

  return (
    <CalcitePanel
      heading={heading}
      height-scale="l"
      data-panel-id={dataPanelId}
      hidden={panelOpen}
    >
      <div id={divId}></div>
      {/* {view && (
        <CalciteLabel layout="inline">
        tuulikud väljas
        <CalciteSwitch onCalciteSwitchChange={checkWindmills}></CalciteSwitch>
        tuulikud sees
    </CalciteLabel>
      )} */}
      {view && (
        <CalciteButton
          label="Add windmills"
          disabled={windmillDisplayed}
          onClick={checkWindmills}
          width="half"
          iconStart="initiative"
        >
          Lisa tuulikud
        </CalciteButton>
      )}
    </CalcitePanel>
  );
};
