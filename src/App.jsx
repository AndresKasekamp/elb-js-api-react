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
  compareVisibleLayers,
  // setNoBasemap,
} from "./modules/layers.js";
import { setupWebScene, setupWebView } from "./modules/scene.js";
import {
  setupLayerListMain,
  setupLayerListWMS,
  setupBasemapGallery,
  loadWMStile,
  getLayerInfo,
} from "./modules/layerList";
import { setupCoordinateWidget, setupNewFormat } from "./modules/coordinate.js";
import { setupLoS, getStartPoint } from "./modules/lineOfSight.js";
import {
  setupCustomSearchSource,
  setupSearchWidget,
} from "./modules/search.js";
import { setupSketch } from "./modules/sketch.js";
import { setupDaylight } from "./modules/daylight.js";
import { setupElevationProfile } from "./modules/elevationProfile.js";
import { setupMeasurement } from "./modules/measurement.js";
import { setupShadowCast } from "./modules/shadowCast.js";
import { setupSlice } from "./modules/slice.js";
import { setupLocate } from "./modules/locate.js";
import {
  elevationManipulation,
  setupElevationLayer,
} from "./modules/elevation.js";
import {
  getUndergroundInfo,
  getLayerVisibility,
  getElevationVisibility,
  getLocation,
  copyTextToClipboard,
  createURL,
  setupViewPoint,
} from "./modules/goToLocation.js";

// Calcite components
import "@esri/calcite-components/dist/components/calcite-shell.js";
import "@esri/calcite-components/dist/components/calcite-shell-panel.js";
import "@esri/calcite-components/dist/components/calcite-action-bar.js";
import "@esri/calcite-components/dist/components/calcite-action.js";
import "@esri/calcite-components/dist/components/calcite-tooltip.js";
import "@esri/calcite-components/dist/components/calcite-alert.js";
import "@esri/calcite-components/dist/components/calcite-panel.js";
import "@esri/calcite-components/dist/components/calcite-checkbox.js";
import "@esri/calcite-components/dist/components/calcite-label.js";
import "@esri/calcite-components/dist/components/calcite-slider.js";
import "@esri/calcite-components/dist/components/calcite-radio-button-group.js";
import "@esri/calcite-components/dist/components/calcite-radio-button.js";
import "@esri/calcite-components/dist/components/calcite-input-text.js";
import "@esri/calcite-components/dist/components/calcite-button.js";
import {
  CalciteShell,
  CalciteShellPanel,
  CalciteActionBar,
  CalciteAction,
  CalciteTooltip,
  CalciteAlert,
  CalcitePanel,
  CalciteCheckbox,
  CalciteLabel,
  CalciteSlider,
  CalciteRadioButtonGroup,
  CalciteRadioButton,
  CalciteInputText,
  CalciteButton,
} from "@esri/calcite-components-react";

import { BasemapGalleryPanel } from "./components/BasemapGalleryPanel.jsx";
// import { BasemapSwitch } from "./components/BasemapSwitch.jsx";

// CSS modules
import "./App.css";
import "@esri/calcite-components/dist/calcite/calcite.css";

function App() {
  const mapDiv = useRef(null);

  const [basemaps, setBasemaps] = useState(null);
  const [view, setView] = useState(null);

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

        // TODO kui kakskeelseks teha, siis peaks ilmselt läbi portaali ära kaotama ja tekstid kuhugi lisama
        const { description } = scene.portalItem;
        const itemDesc = document.querySelector("#item-description");
        itemDesc.innerHTML = description;

        /**************************************
         * Built-in UI components
         **************************************/
        view.ui.move("zoom", "top-right");
        view.ui.move("navigation-toggle", "top-right");
        view.ui.move("compass", "top-right");

        /**************************************
         * Line of Sight analysis custom
         **************************************/
        getStartPoint(view);

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

        // setNoBasemap(basemaps, view);

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
         * Elevation toolbox
         **************************************/

        elevationManipulation(view);

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

        setupMeasurement(view);

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

        /**************************************
         * Calcite CSS/JS
         **************************************/

        // TODO võiks ka eraldi calcite funktsioonideks kirjutada
        const shadowCast = setupShadowCast(view);

        let activeWidget;

        const handleActionBarClick = ({ target }) => {
          if (target.tagName !== "CALCITE-ACTION") {
            return;
          }

          if (activeWidget) {
            document.querySelector(
              `[data-action-id=${activeWidget}]`
            ).active = false;
            document.querySelector(
              `[data-panel-id=${activeWidget}]`
            ).hidden = true;
          }

          const nextWidget = target.dataset.actionId;
          if (nextWidget !== activeWidget) {
            document.querySelector(
              `[data-action-id=${nextWidget}]`
            ).active = true;
            document.querySelector(
              `[data-panel-id=${nextWidget}]`
            ).hidden = false;
            activeWidget = nextWidget;
          } else {
            activeWidget = null;
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

            const sharedLocation = createURL(
              view,
              regularLayers,
              elevationChanged
            );
            copyTextToClipboard(sharedLocation);

            // Displaying popup
            const shareMapAlert = document.getElementById("share-map-alert");
            shareMapAlert.open = "true";
          }
        };

        document
          .querySelector("calcite-action-bar")
          .addEventListener("click", handleActionBarClick);

        let actionBarExpanded = false;

        document.addEventListener("calciteActionBarToggle", (event) => {
          actionBarExpanded = !actionBarExpanded;
          view.padding = {
            left: actionBarExpanded ? 135 : 49,
          };
        });

        /**************************************
         * Parsing URL if sharing is used
         **************************************/

        // Going to specified location at runtime
        const locationArray = getLocation();
        getUndergroundInfo(view);
        getLayerVisibility(view);
        getElevationVisibility(view);

        if (locationArray !== null) {
          const viewpoint = setupViewPoint(locationArray);
          view.goTo(viewpoint, { animate: false });
        }
      });
    }
  }, [mapDiv]);

  return (
    <>
      <CalciteShell content-behind id="calcite-shell">
        <div slot="header" id="header">
          <h2 id="header-title">Maa-amet 3D</h2>
          <div id="in-ads-container"></div>
        </div>

        <CalciteShellPanel slot="panel-start" displayMode="float">
          <CalciteActionBar slot="action-bar" class="responsive-action-bar">
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

          <CalciteAlert
            id="share-map-alert"
            label="share-map-alert"
            auto-close
            auto-close-duration="fast"
            kind="success"
          >
            <div slot="message">Copied map location to the clipboard</div>
          </CalciteAlert>

          <CalcitePanel
            heading="Layers"
            height-scale="l"
            data-panel-id="layers"
            hidden
          >
            <div id="layers-container"></div>
          </CalcitePanel>
          <CalcitePanel
            heading="WMS"
            height-scale="l"
            data-panel-id="layers-wms"
            hidden
          >
            <div id="wms-layers-container"></div>
          </CalcitePanel>

          <BasemapGalleryPanel basemaps={basemaps} view={view} />

          <CalcitePanel
            heading="Elevation settings"
            height-scale="l"
            data-panel-id="elevation"
            hidden
          >
            <CalciteRadioButtonGroup
              id="elevationModels"
              name="ElevationModels"
              layout="vertical"
            >
              <CalciteLabel layout="inline">
                <CalciteRadioButton
                  id="dtmElevation"
                  value="987798be0faa561d"
                  checked
                ></CalciteRadioButton>
                DTM
              </CalciteLabel>
              <CalciteLabel layout="inline">
                <CalciteRadioButton
                  id="apElevation"
                  value="bae50815bbab6ded"
                ></CalciteRadioButton>
                Aluspõhi 50m
              </CalciteLabel>
              <CalciteLabel layout="inline">
                <CalciteRadioButton
                  id="akElevation"
                  value="974102ce30be63bb"
                ></CalciteRadioButton>
                Aluskord 50m
              </CalciteLabel>
            </CalciteRadioButtonGroup>

            <CalciteLabel layout="inline">
              <CalciteCheckbox
                id="navigationUnderground"
                checked
              ></CalciteCheckbox>
              Navigate underground
            </CalciteLabel>

            <CalciteLabel layout="inline">
              <CalciteCheckbox id="elevationInput" checked></CalciteCheckbox>
              Elevation
            </CalciteLabel>
          </CalcitePanel>

          <CalcitePanel
            heading="Line of Sight"
            height-scale="l"
            data-panel-id="lineOfSight"
            hidden
          >
            <div id="line-of-sight-container"></div>
            <CalciteLabel>
              Start coordinates
              <form id="losForm">
                <CalciteInputText
                  id="xLOSstart"
                  name="xLOSstart"
                  prefix-text="X-coordinate"
                  value=""
                ></CalciteInputText>
                <CalciteInputText
                  id="yLOSstart"
                  name="yLOSstart"
                  prefix-text="Y-coordinate"
                  value=""
                ></CalciteInputText>
                <CalciteInputText
                  id="zLoSstart"
                  name="zLOSstart"
                  prefix-text="Z-coordinate"
                  value=""
                ></CalciteInputText>
              </form>
              <CalciteButton
                form="losForm"
                id="LoSstartBtn"
                name="LoSstartBtn"
                width="half"
              >
                Submit
              </CalciteButton>
            </CalciteLabel>
          </CalcitePanel>

          <CalcitePanel height-scale="l" data-panel-id="daylight" hidden>
            <div id="daylight-container"></div>
          </CalcitePanel>

          <CalcitePanel
            heading="Elevation profile"
            height-scale="l"
            data-panel-id="elevationProfile"
            hidden
          >
            <div id="elevation-profile-container"></div>
          </CalcitePanel>

          <CalcitePanel
            heading="Measurements"
            width-scale="s"
            height-scale="l"
            data-panel-id="measurement"
            hidden
          >
            <CalciteAction
              id="distanceButton"
              icon="measure-line"
              text="Measure line"
              text-enabled
            ></CalciteAction>
            <CalciteAction
              id="areaButton"
              icon="measure-area"
              text="Measure area"
              text-enabled
            ></CalciteAction>
            <CalciteAction
              id="clearButton"
              icon="trash"
              text="Clear"
              text-enabled
            ></CalciteAction>
            <div id="measurement-container"></div>
          </CalcitePanel>

          <CalcitePanel height-scale="l" data-panel-id="shadowCast" hidden>
            <div id="shadowcast-container"></div>
          </CalcitePanel>

          <CalcitePanel
            heading="Slicing"
            height-scale="l"
            data-panel-id="slicing"
            hidden
          >
            <div id="slicing-container"></div>
          </CalcitePanel>

          <CalcitePanel
            heading="Sketching"
            height-scale="l"
            data-panel-id="sketching"
            hidden
          >
            <div id="sketchPanel" className="esri-widget">
              <div id="startbuttons">
                <button
                  id="point"
                  data-type="point"
                  className="esri-button starttool"
                >
                  Draw a point of interest
                </button>
                <button
                  id="line"
                  data-type="polyline"
                  className="esri-button starttool"
                >
                  Draw a route
                </button>
                <button
                  id="extrudedPolygon"
                  data-type="polygon"
                  className="esri-button starttool"
                >
                  Draw a building
                </button>
              </div>
              <div id="actionbuttons">
                <button id="cancel" className="esri-button">
                  Cancel
                </button>
                <button id="done" className="esri-button">
                  Done
                </button>
              </div>

              <div id="edgeoperationbuttons">
                <div id="extrudeSliderContainer">
                  <div>
                    Extrude value: <span id="extrude">10</span>
                  </div>
                  <div id="extrudeSlider"></div>
                </div>
                <br />
                Select the edge operation:
                <div className="update-options" id="edge">
                  <button
                    className="esri-widget--button edge-button"
                    id="none-edge-button"
                    value="none"
                  >
                    None
                  </button>
                  <button
                    className="esri-widget--button edge-button edge-button-selected"
                    id="split-edge-button"
                    value="split"
                  >
                    Split
                  </button>
                  <button
                    className="esri-widget--button edge-button"
                    id="offset-edge-button"
                    value="offset"
                  >
                    Offset
                  </button>
                </div>
                Select the move operation:
                <div className="update-options" id="shape">
                  <button
                    className="esri-widget--button shape-button"
                    id="none-shape-button"
                    value="none"
                  >
                    None
                  </button>
                  <button
                    className="esri-widget--button shape-button shape-button-selected"
                    id="move-shape-button"
                    value="move"
                  >
                    Move
                  </button>
                </div>
              </div>
            </div>
          </CalcitePanel>

          <CalcitePanel
            id="information-panel"
            heading="Details"
            data-panel-id="information"
            hidden
          >
            <div id="info-content">
              <div id="item-description"></div>
            </div>
          </CalcitePanel>

          <CalcitePanel
            height-scale="l"
            data-panel-id="share"
            hidden
            closed
          ></CalcitePanel>
        </CalciteShellPanel>

        <div className="mapDiv" ref={mapDiv}></div>
      </CalciteShell>
    </>
  );
}

export default App;
