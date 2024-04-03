import React, { useState, useEffect } from "react";

import "@esri/calcite-components/dist/components/calcite-action-bar.js";
import "@esri/calcite-components/dist/components/calcite-action.js";
import "@esri/calcite-components/dist/components/calcite-tooltip.js";
import {
  CalciteActionBar,
  CalciteAction,
  CalciteTooltip,
} from "@esri/calcite-components-react";

import { ShareMapAlert } from "../ShareMap/ShareMapAlert";
import {
  getVisibleLayers,
  compareVisibleLayers,
} from "../../modules/layers.ts";
import { createURL, copyTextToClipboard } from "../../modules/goToLocation.ts";
import { XGISMapPanel } from "../Analysis/XGISMapPanel.jsx";
import { KaldaerofotoPanel } from "../Analysis/KaldaerofotoPanel.jsx";

// TODO või võtta ära aktiivsuse indikaator modali tööriistadelt?
// TODO sharemap bug, kui avada üks mis järgmine tööriist
// TODO propi peaks tõstma, et muutused oleks õiged: https://react.dev/learn/sharing-state-between-components
//https://fotoladu.maaamet.ee/etak.php?x=548727&y=6590232&view4



export const ActionBar = ({ view, shadowCast, initVisibleLayers }) => {

  const [IconSize, setIconSize] = useState("l");

  // TODO vb panna s ka modiibivaate jaoks
  useEffect(() => {
    const updateIconSize = () => {
      const newIconSize = window.innerHeight < 1200 ? "m" : "l";
      setIconSize(newIconSize);
    };

    // Initial calculation
    updateIconSize();

    // Listen for window resize events
    window.addEventListener("resize", updateIconSize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateIconSize);
    };
  }, []);

  const [actionbar, setActionbar] = useState(false);
  const [activeWidget, setActiveWidget] = useState(null);
  const [shareOpen, setShareOpen] = useState(undefined);
  const [xgisPanelOpen, setXgisPanelOpen] = useState(false);
  const [share2dCoordinates, setShare2dCoordinates] = useState({
    xmin: 0,
    ymin: 0,
    xmax: 0,
    ymax: 0,
  });
  const [kaldCoordinates, setKaldCoordinates] = useState({ x: 0, y: 0 });
  const [kaldfotoPanelOpen, setKaldFotoPanelOpen] = useState(false);

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

    // TODO see vajaks refactorit
    if (nextWidget === "x-gis-map") {
      const { xmin, ymin, xmax, ymax } = view.extent;
      setXgisPanelOpen(!xgisPanelOpen);
      setShare2dCoordinates({ xmin, ymin, xmax, ymax });
    }

    if (nextWidget === "kaldfoto") {
      const { x, y } = view.camera.position;
      setKaldFotoPanelOpen(!kaldfotoPanelOpen);
      setKaldCoordinates({ x, y });
    }

    if (nextWidget === "share") {
      const visibleLayersCurrently = getVisibleLayers(view);

      const [regularLayers, elevationChanged] = compareVisibleLayers(
        initVisibleLayers,
        visibleLayersCurrently
      );

      const sharedLocation = createURL(view, regularLayers, elevationChanged);
      copyTextToClipboard(sharedLocation);
      setShareOpen(true);
      setTimeout(() => {
        setShareOpen(undefined);
      }, 6000);
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
          scale={IconSize}
        ></CalciteAction>
        <CalciteAction
          data-action-id="layers-wms"
          icon="image-layer"
          text="WMS"
          scale={IconSize}
        ></CalciteAction>
        <CalciteAction
          data-action-id="basemaps"
          icon="layer-basemap"
          text="Basemaps"
          scale={IconSize}
        ></CalciteAction>
        <CalciteAction
          data-action-id="elevation"
          icon="sky-plot"
          text="Elevation"
          scale={IconSize}
        ></CalciteAction>
        <CalciteAction
          data-action-id="lineOfSight"
          icon="line-of-sight"
          text="Line of Sight"
          scale={IconSize}
        ></CalciteAction>
        <CalciteAction
          data-action-id="daylight"
          icon="date-time"
          text="Daylight"
          scale={IconSize}
        ></CalciteAction>
        <CalciteAction
          data-action-id="elevationProfile"
          icon="altitude"
          text="Elevation profile"
          scale={IconSize}
        ></CalciteAction>
        <CalciteAction
          data-action-id="measurement"
          icon="measure"
          text="Measurements"
          scale={IconSize}
        ></CalciteAction>
        <CalciteAction
          data-action-id="shadowCast"
          icon="measure-building-height-shadow"
          text="Shadow cast"
          scale={IconSize}
        ></CalciteAction>
        <CalciteAction
          data-action-id="slicing"
          icon="slice"
          text="Slicing"
          scale={IconSize}
        ></CalciteAction>
        <CalciteAction
          data-action-id="sketching"
          icon="freehand"
          text="Sketch"
          scale={IconSize}
        ></CalciteAction>
        <CalciteAction
          data-action-id="information"
          icon="information"
          text="Information"
          scale={IconSize}
        ></CalciteAction>
        <CalciteAction
          id="share-tooltip"
          data-action-id="share"
          icon="share"
          text="Share"
          scale={IconSize}
        ></CalciteAction>
        <CalciteAction
          id="x-gis-map"
          data-action-id="x-gis-map"
          icon="map"
          text="2D kaart"
          scale={IconSize}
        ></CalciteAction>
        <CalciteAction
          id="kaldfoto"
          data-action-id="kaldfoto"
          icon="camera"
          text="Kaldaerofotod"
          scale={IconSize}
        ></CalciteAction>
        <CalciteTooltip reference-element="share-tooltip">
          <span>Share a map</span>
        </CalciteTooltip>
        <XGISMapPanel
          xgisPanelOpen={xgisPanelOpen}
          share2dCoordinates={share2dCoordinates}
        />
        <KaldaerofotoPanel
          kaldfotoPanelOpen={kaldfotoPanelOpen}
          kaldCoordinates={kaldCoordinates}
        />
      </CalciteActionBar>
      <ShareMapAlert shareOpen={shareOpen} />
    </>
  );
};
