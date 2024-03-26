import React, { useState } from "react";

import "@esri/calcite-components/dist/components/calcite-action-bar.js";
import "@esri/calcite-components/dist/components/calcite-action.js";
import "@esri/calcite-components/dist/components/calcite-tooltip.js";
import {
  CalciteActionBar,
  CalciteAction,
  CalciteTooltip,
} from "@esri/calcite-components-react";

import { ShareMapAlert } from "../ShareMap/ShareMapAlert";
import { getVisibleLayers, compareVisibleLayers } from "../../modules/layers.ts";
import { createURL, copyTextToClipboard } from "../../modules/goToLocation.ts";

export const ActionBar = ({ view, shadowCast, initVisibleLayers }) => {
  const [actionbar, setActionbar] = useState(false);
  const [activeWidget, setActiveWidget] = useState(null);
  const [shareOpen, setShareOpen] = useState(undefined)

  const handleActionBarClick = (e) => {
    if (e.target.tagName !== "CALCITE-ACTION") {
      return;
    }

    if (activeWidget) {
      document.querySelector(`[data-action-id=${activeWidget}]`).active = false;
      document.querySelector(`[data-panel-id=${activeWidget}]`).hidden = true;
    }

    const nextWidget = e.target.dataset.actionId;
    if (nextWidget !== activeWidget) {
      document.querySelector(`[data-action-id=${nextWidget}]`).active = true;
      document.querySelector(`[data-panel-id=${nextWidget}]`).hidden = false;
      setActiveWidget(nextWidget);
    } else {
      setActiveWidget(null);
    }

    if (nextWidget === "shadowCast") {
      shadowCast.visible = !shadowCast.visible;
    }

    if (nextWidget === "share") {
      const visibleLayersCurrently = getVisibleLayers(view);

      const [regularLayers, elevationChanged] = compareVisibleLayers(
        initVisibleLayers,
        visibleLayersCurrently
      );

      const sharedLocation = createURL(view, regularLayers, elevationChanged);
      copyTextToClipboard(sharedLocation);

      // TODO see peaks olema state probably
      setShareOpen(true)
      // Displaying popup
      // const shareMapAlert = document.getElementById("share-map-alert");
      // shareMapAlert.open = "true";
    }
  };

  const handleActionBarToggle = () => {
    setActionbar(!actionbar);
    view.padding = { left: actionbar ? 135 : 49 };
  };

  return (
    <>
      <CalciteActionBar
        slot="action-bar"
        class="responsive-action-bar"
        onCalciteActionBarToggle={handleActionBarToggle}
        onClick={handleActionBarClick}
      >
        <CalciteAction
          data-action-id="layers"
          icon="layers"
          text="Layers"
          scale="l"
        ></CalciteAction>
        <CalciteAction
          data-action-id="layers-wms"
          icon="image-layer"
          text="WMS"
          scale="l"
        ></CalciteAction>
        <CalciteAction
          data-action-id="basemaps"
          icon="layer-basemap"
          text="Basemaps"
          scale="l"
        ></CalciteAction>
        <CalciteAction
          data-action-id="elevation"
          icon="sky-plot"
          text="Elevation"
          scale="l"
        ></CalciteAction>
        <CalciteAction
          data-action-id="lineOfSight"
          icon="line-of-sight"
          text="Line of Sight"
          scale="l"
        ></CalciteAction>
        <CalciteAction
          data-action-id="daylight"
          icon="date-time"
          text="Daylight"
          scale="l"
        ></CalciteAction>
        <CalciteAction
          data-action-id="elevationProfile"
          icon="altitude"
          text="Elevation profile"
          scale="l"
        ></CalciteAction>
        <CalciteAction
          data-action-id="measurement"
          icon="measure"
          text="Measurements"
          scale="l"
        ></CalciteAction>
        <CalciteAction
          data-action-id="shadowCast"
          icon="measure-building-height-shadow"
          text="Shadow cast"
          scale="l"
        ></CalciteAction>
        <CalciteAction
          data-action-id="slicing"
          icon="slice"
          text="Slicing"
          scale="l"
        ></CalciteAction>
        <CalciteAction
          data-action-id="sketching"
          icon="freehand"
          text="Sketch"
          scale="l"
        ></CalciteAction>
        <CalciteAction
          data-action-id="information"
          icon="information"
          text="Information"
          scale="l"
        ></CalciteAction>
        <CalciteAction
          id="share-tooltip"
          data-action-id="share"
          icon="share"
          text="Share"
          scale="l"
        ></CalciteAction>
        <CalciteTooltip reference-element="share-tooltip">
          <span>Share a map</span>
        </CalciteTooltip>
      </CalciteActionBar>
      <ShareMapAlert shareOpen={shareOpen} />
    </>
  );
};
