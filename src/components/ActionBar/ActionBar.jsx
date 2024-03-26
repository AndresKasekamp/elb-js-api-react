import React, { useState } from "react";

import "@esri/calcite-components/dist/components/calcite-action-bar.js";
import "@esri/calcite-components/dist/components/calcite-action.js";
import "@esri/calcite-components/dist/components/calcite-tooltip.js";
import {
  CalciteActionBar,
  CalciteAction,
  CalciteTooltip,
} from "@esri/calcite-components-react";

export const ActionBar = ({ view }) => {
  const [actionbar, setActionbar] = useState(false);

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
    </>
  );
};
