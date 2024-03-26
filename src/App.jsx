import React, { useRef, useEffect, useState } from "react";

// Esri imports
import Conversion from "@arcgis/core/widgets/CoordinateConversion/support/Conversion.js";

// Local imports
import {
  setupGraphicsLayer,
  setupInternalLayer,
  setupWMSLayer,
  getGeologyLayers,
  setupGroupLayer,
  taimkateWorkaround,
  getVisibleLayers,
} from "./modules/layers.ts";
import { setupWebScene, setupWebView } from "./modules/scene.ts";
import {
  setupLayerListMain,
  setupLayerListWMS,
  setupBasemapGallery,
  loadWMStile,
  getLayerInfo,
} from "./modules/layerList.ts";

import {setupLayerListMain2} from "./modules/layerList2.tsx"

import { setupCoordinateWidget, setupNewFormat } from "./modules/coordinate.ts";
import { setupLoS } from "./modules/lineOfSight.ts";
import {
  setupCustomSearchSource,
  setupSearchWidget,
} from "./modules/search.ts";
import { setupSketch } from "./modules/sketch.js";
import { setupDaylight } from "./modules/daylight.ts";
import { setupElevationProfile } from "./modules/elevationProfile.ts";
import { setupMeasurement } from "./modules/measurement.ts";
import { setupShadowCast } from "./modules/shadowCast.ts";
import { setupSlice } from "./modules/slice.ts";
import { setupLocate } from "./modules/locate.ts";
import { setupElevationLayer } from "./modules/elevation.ts";
import {
  getUndergroundInfo,
  getLayerVisibility,
  getElevationVisibility,
  getLocation,
  setupViewPoint,
} from "./modules/goToLocation.ts";

// Calcite components
import "@esri/calcite-components/dist/components/calcite-shell.js";
import "@esri/calcite-components/dist/components/calcite-shell-panel.js";

import {
  CalciteShell,
  CalciteShellPanel,
} from "@esri/calcite-components-react";

import { ActionBar } from "./components/ActionBar/ActionBar.jsx";
import { BasemapGalleryPanel } from "./components/Basemaps/BasemapGalleryPanel.jsx";
import { ElevationGalleryPanel } from "./components/Elevation/ElevationGalleryPanel.jsx";
import { LayerPanel } from "./components/LayerPanel/LayerPanel.jsx";
import { LineOfSightPanel } from "./components/Analysis/LineOfSightPanel.jsx";
import { DayLightPanel } from "./components/Analysis/DayLightPanel.jsx";
import { ElevationProfilePanel } from "./components/Analysis/ElevationProfilePanel.jsx";
import { MeasurementPanel } from "./components/Analysis/MeasurementPanel.jsx";
import { ShadowCastPanel } from "./components/Analysis/ShadowCastPanel.jsx";
import { SlicingPanel } from "./components/Analysis/SlicingPanel.jsx";
import { SharePanel } from "./components/ShareMap/SharePanel.jsx";
import { InformationPanel } from "./components/Analysis/InformationPanel.jsx";
import { SketchingPanel } from "./components/Analysis/SketchingPanel.jsx";
import { Header } from "./components/ActionBar/Header.jsx";

// CSS modules
import "./App.css";
import "@esri/calcite-components/dist/calcite/calcite.css";

function App() {
  const mapDiv = useRef(null);

  // States to be used in component
  const [basemaps, setBasemaps] = useState(null);
  const [view, setView] = useState(null);
  const [shadowCast, setShadowcast] = useState(null);
  const [measurement, setMeasurement] = useState(null);
  const [description, setDescription] = useState(null);
  const [initVisibleLayers, setInitVisibleLayers] = useState(null);
  const [navigationUndergroundButton, setNavigationUndergroundButton] =
    useState(undefined);
  const [checkedElevation, setCheckedElevation] = useState(null);

  useEffect(() => {
    if (mapDiv.current) {
      /**
       * Initialize application
       */
      console.log("Map initialized");

      const graphicsLayer = setupGraphicsLayer();

      const communicationTower = setupInternalLayer(
        "66e382030b224ffa999249a4d1cbbf4f",
        "Sidemastid"
      );

      const ortofotoWMS = setupWMSLayer();

      const scene = setupWebScene(
        "92d29869db444e28beab584f696b86c3",
        graphicsLayer,
        ortofotoWMS
      );

      const geologyScene = setupWebScene("da15a55042b54c31b0208ba98c1647fc");

      const geologyView = setupWebView(geologyScene, mapDiv.current);

      const apDTM = setupElevationLayer(
        "https://tiles.arcgis.com/tiles/ZYGCYltwz5ExeoGm/arcgis/rest/services/APR_50m_Eesti_tif/ImageServer",
        "Aluspõhi 50m"
      );
      const akDTM = setupElevationLayer(
        "https://tiles.arcgis.com/tiles/ZYGCYltwz5ExeoGm/arcgis/rest/services/AKR_50m_2/ImageServer",
        "Aluskord 50m"
      );

      const view = setupWebView(scene, mapDiv.current);
      setView(view);

      // Loading twice so both scenes can be active
      geologyView.when(() => {
        view.when(() => {
          /**************************************
           * Geology layer setup
           **************************************/
          const geologyLayers = getGeologyLayers(geologyView);

          const boreholes = geologyLayers.items.find(
            // (layer) => layer.title === "Puurkaevud/puuraugud"
            (layer) => layer.title === "Andmepunktid"
          );
          const constructionGeology = geologyLayers.items.find(
            (layer) => layer.title === "Ehitusgeoloogia"
          );
          const geologyWMS = geologyLayers.items.find(
            (layer) => layer.title === "Geoloogia WMS"
          );
          geologyWMS.visible = false;

          // Adding other DTM layers layers
          view.map.ground.layers.addMany([apDTM, akDTM]);

          /**************************************
           * Desc info
           **************************************/
          // TODO siin on ikka raw HTML probleem
          const { description } = scene.portalItem;
          setDescription(description);

          /**************************************
           * Built-in UI components
           **************************************/
          view.ui.move("zoom", "top-right");
          view.ui.move("navigation-toggle", "top-right");
          view.ui.move("compass", "top-right");

          /**************************************
           * Line of Sight analysis custom
           **************************************/
          // TODO arendus tuleb hiljem
          // getStartPoint(view);

          /**************************************
           * Reworking taimkate logic
           **************************************/

          const treeGroupLayer = setupGroupLayer("Taimkate", "exclusive");

          taimkateWorkaround(treeGroupLayer, view);

          // Add the GroupLayer to view
          view.map.add(treeGroupLayer);

          /**************************************
           * Layerlist from scene
           **************************************/
          const layerList = setupLayerListMain(view);
          // const layerList = setupLayerListMain2(view);

          getLayerInfo(layerList, view);

          /**************************************
           * WMS layerlist gallery
           **************************************/
          const wmsLayerList = setupLayerListWMS(view);

          getLayerInfo(wmsLayerList, view);

          /**************************************
           * Basemap gallery
           **************************************/
          const basemaps = setupBasemapGallery(view);
          setBasemaps(basemaps);
          loadWMStile(basemaps, view);

          /**************************************
           * Geology layer group
           **************************************/

          // Creating a geology layer group
          const geologyGroupLayer = setupGroupLayer("Geoloogia", "independent");
          geologyGroupLayer.addMany([boreholes, constructionGeology]);

          // Adding a geology layer group to view
          view.map.add(geologyGroupLayer);

          // Geology WMS
          view.map.add(geologyWMS);

          // TODO exxaggeration ka tuua üle - aga see veits keerulisem

          /**************************************
           *  Coordinate tool
           **************************************/
          const ccWidget = setupCoordinateWidget(view);
          const newFormat = setupNewFormat();
          ccWidget.formats.add(newFormat);

          ccWidget.conversions.splice(
            0,
            0,
            new Conversion({ format: newFormat })
          );

          view.ui.add(ccWidget, "bottom-right");

          /**************************************
           * Initialize the LineOfSight widget
           **************************************/
          setupLoS(view);

          /**************************************
           * Initialize the Search Widget
           **************************************/
          const customSearchSource = setupCustomSearchSource();
          setupSearchWidget(view, customSearchSource);

          /**************************************
           * Initialize daylight
           **************************************/

          setupDaylight(view);

          /**************************************
           *  Elevation profile
           **************************************/

          setupElevationProfile(view);

          /**************************************
           *  Measurement 3D
           **************************************/

          const measurement = setupMeasurement(view);
          setMeasurement(measurement);

          /**************************************
           * Slicing
           **************************************/

          setupSlice(view);

          /**************************************
           * Locate
           **************************************/
          const locate = setupLocate(view);

          view.ui.add(locate, "top-right");

          /**************************************
           * Sketching
           **************************************/

          setupSketch(view, graphicsLayer);

          /**************************************
           * Rotating windmills
           **************************************/
          // TODO selle kuvamine võiks olla dummy kihi kaudu (ka renderdamine, sest muidu jookseb app liiga kaua ilmselt)
          // displayWindmills(view);

          /**************************************
           * Reordering layers
           **************************************/

          // Reordering for on-the-fly layers
          view.map.reorder(treeGroupLayer, 6);
          view.map.reorder(geologyGroupLayer, 6);
          view.map.reorder(geologyWMS, -1);

          // Replacing sidemastid location, adding to correct group
          const rajatisedGroup = view.map.findLayerById("180fa46104d-layer-35");
          rajatisedGroup.add(communicationTower);

          /**************************************
           * Collecting visible layers before modification and rerendering
           **************************************/
          const initVisibleLayers = getVisibleLayers(view);
          setInitVisibleLayers(initVisibleLayers);

          /**************************************
           * Calcite CSS/JS
           **************************************/
          const shadowCast = setupShadowCast(view);
          setShadowcast(shadowCast);

          /**************************************
           * Parsing URL if sharing is used
           **************************************/

          // Going to specified location at runtime
          const locationArray = getLocation();

          const navigationUndergroundButton = getUndergroundInfo(view);
          setNavigationUndergroundButton(navigationUndergroundButton);

          getLayerVisibility(view);
          const checkedElevation = getElevationVisibility(view);
          setCheckedElevation(checkedElevation);

          if (locationArray !== null) {
            const viewpoint = setupViewPoint(locationArray);
            view.goTo(viewpoint, { animate: false });
          }
        });
      });
    }
  }, [mapDiv]);

  return (
    <>
      <CalciteShell content-behind id="calcite-shell">
        <Header />

        <CalciteShellPanel slot="panel-start" displayMode="float">
          <ActionBar
            view={view}
            shadowCast={shadowCast}
            initVisibleLayers={initVisibleLayers}
          />

          <LayerPanel
            heading={"Layers"}
            dataPanelId={"layers"}
            divId={"layers-container"}
          />
          <LayerPanel
            heading={"WMS"}
            dataPanelId={"layers-wms"}
            divId={"wms-layers-container"}
          />
          <BasemapGalleryPanel basemaps={basemaps} view={view} />
          <ElevationGalleryPanel
            view={view}
            navigationUndergroundButton={navigationUndergroundButton}
            checkedElevation={checkedElevation}
          />
          <LineOfSightPanel />
          <DayLightPanel />
          <ElevationProfilePanel />
          <MeasurementPanel measurement={measurement} />
          <ShadowCastPanel />
          <SlicingPanel />
          <SketchingPanel />
          <InformationPanel description={description} />
          <SharePanel />
        </CalciteShellPanel>

        <div className="mapDiv" ref={mapDiv}></div>
      </CalciteShell>
    </>
  );
}

export default App;
