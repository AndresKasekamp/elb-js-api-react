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

import { setupCoordinateWidget, setupNewFormat } from "./modules/coordinate.ts";
import { setupLoS } from "./modules/lineOfSight.ts";
import {
  setupCustomSearchSource,
  setupSearchWidget,
} from "./modules/search.ts";
import { setupSketch } from "./modules/sketch.ts";
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

// import { displayWindmills } from "./modules/dev/rotatingWindmills.js"

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
  // References
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
  const [elevationOnOff, setElevationOnOff] = useState(null);
  const [losAnalysis, setLosAnalysis] = useState(null);

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

      const sceneView = setupWebView(scene, mapDiv.current);
      setView(sceneView);

      // Loading twice so both scenes can be active
      geologyView.when(async () => {
        sceneView.when(async () => {
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
          sceneView.map.ground.layers.addMany([apDTM, akDTM]);

          /**************************************
           * Desc info
           **************************************/
          // TODO siin on ikka raw HTML probleem
          const { description } = scene.portalItem;
          setDescription(description);

          /**************************************
           * Built-in UI components
           **************************************/
          sceneView.ui.move("zoom", "top-right");
          sceneView.ui.move("navigation-toggle", "top-right");
          sceneView.ui.move("compass", "top-right");

          /**************************************
           * Line of Sight analysis custom
           **************************************/
          // TODO arendus tuleb hiljem
          // getStartPoint(view);

          /**************************************
           * Reworking taimkate logic
           **************************************/

          const treeGroupLayer = setupGroupLayer("Taimkate", "exclusive");

          taimkateWorkaround(treeGroupLayer, sceneView);

          // Add the GroupLayer to view
          sceneView.map.add(treeGroupLayer);

          /**************************************
           * Layerlist from scene
           **************************************/
          const layerList = setupLayerListMain(sceneView);
          getLayerInfo(layerList, sceneView);

          /**************************************
           * WMS layerlist gallery
           **************************************/
          const wmsLayerList = setupLayerListWMS(sceneView);

          getLayerInfo(wmsLayerList, sceneView);

          /**************************************
           * Basemap gallery
           **************************************/
          const basemaps = setupBasemapGallery(sceneView);
          setBasemaps(basemaps);
          loadWMStile(basemaps, sceneView);

          /**************************************
           * Geology layer group
           **************************************/

          // Creating a geology layer group
          const geologyGroupLayer = setupGroupLayer("Geoloogia", "independent");
          geologyGroupLayer.addMany([boreholes, constructionGeology]);

          // Adding a geology layer group to view
          sceneView.map.add(geologyGroupLayer);

          // Geology WMS
          sceneView.map.add(geologyWMS);

          // TODO exxaggeration ka tuua üle - aga see veits keerulisem

          /**************************************
           *  Coordinate tool
           **************************************/
          const ccWidget = setupCoordinateWidget(sceneView);
          const newFormat = setupNewFormat();
          ccWidget.formats.add(newFormat);

          ccWidget.conversions.splice(
            0,
            0,
            new Conversion({ format: newFormat })
          );

          sceneView.ui.add(ccWidget, "bottom-right");

          /**************************************
           * Initialize the LineOfSight widget
           **************************************/
          const losAnalysis = setupLoS(sceneView);
          setLosAnalysis(losAnalysis);

          /**************************************
           * Initialize the Search Widget
           **************************************/
          const customSearchSource = setupCustomSearchSource();
          setupSearchWidget(sceneView, customSearchSource);

          /**************************************
           * Initialize daylight
           **************************************/

          setupDaylight(sceneView);

          /**************************************
           *  Elevation profile
           **************************************/

          setupElevationProfile(sceneView);

          /**************************************
           *  Measurement 3D
           **************************************/

          const measurement = setupMeasurement(sceneView);
          setMeasurement(measurement);

          /**************************************
           * Slicing
           **************************************/

          setupSlice(sceneView);

          /**************************************
           * Locate
           **************************************/
          const locate = setupLocate(sceneView);

          sceneView.ui.add(locate, "top-right");

          /**************************************
           * Sketching
           **************************************/

          setupSketch(sceneView, graphicsLayer);

          /**************************************
           * Rotating windmills
           **************************************/

          // await displayWindmills(sceneView)

          /**************************************
           * Reordering layers
           **************************************/

          // Reordering for on-the-fly layers
          sceneView.map.reorder(treeGroupLayer, 6);
          sceneView.map.reorder(geologyGroupLayer, 6);
          sceneView.map.reorder(geologyWMS, -1);

          // Replacing sidemastid location, adding to correct group
          const rajatisedGroup = sceneView.map.findLayerById(
            "180fa46104d-layer-35"
          );
          rajatisedGroup.add(communicationTower);

          /**************************************
           * Collecting visible layers before modification and rerendering
           **************************************/
          const initVisibleLayers = getVisibleLayers(sceneView);
          setInitVisibleLayers(initVisibleLayers);

          /**************************************
           * Calcite CSS/JS
           **************************************/
          const shadowCast = setupShadowCast(sceneView);
          setShadowcast(shadowCast);

          /**************************************
           * Parsing URL if sharing is used
           **************************************/

          // Going to specified location at runtime
          const locationArray = getLocation();

          const navigationUndergroundButton = getUndergroundInfo(sceneView);
          setNavigationUndergroundButton(navigationUndergroundButton);

          getLayerVisibility(sceneView);
          const [checkedElevation, elevationOnOff] =
            getElevationVisibility(sceneView);
          setCheckedElevation(checkedElevation);
          setElevationOnOff(elevationOnOff);

          if (locationArray !== null) {
            const viewpoint = setupViewPoint(locationArray);
            sceneView.goTo(viewpoint, { animate: false });
          }
        });
      });

      return () => {
        if (sceneView && geologyView) {
          // geologyView.container = null;
          // sceneView.container = null;
          sceneView.destroy();
          geologyView.destroy();
        }
      };
    }
  }, [mapDiv]);

  return (
    <div key="main-div" id="main-div">
      <CalciteShell content-behind id="calcite-shell">
        <Header view={view} />
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
            view={view}
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
            elevationOnOff={elevationOnOff}
          />
          <LineOfSightPanel losAnalysis={losAnalysis} />
          <DayLightPanel />
          <ElevationProfilePanel />
          <MeasurementPanel measurement={measurement} />
          <ShadowCastPanel />
          <SlicingPanel />
          <SketchingPanel />
          <InformationPanel description={description} />
          <SharePanel />
        </CalciteShellPanel>

        <div className="mapDiv" key="mapDiv" ref={mapDiv}></div>
      </CalciteShell>
    </div>
  );
}

export default App;
