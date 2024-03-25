// TODO siin saaks veel sättida layerList with actions et sättida opacity slideriga ning saada informatsiooni kihi kohta portaalist
// TODO selleks peaks aga esmalt listima kõik kihid selle all ära või proovima teha seda esmalt läbi sidemastide

import LayerList from "@arcgis/core/widgets/LayerList.js";
import Expand from "@arcgis/core/widgets/Expand.js";
import Basemap from "@arcgis/core/Basemap.js";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery.js";
import { setupSliderStyle } from "./slider.js";
import { setupLegend, setupLegendStyle } from "./legend.js";

//import { setupSliderStyle } from "./modules/slider.js";
const basemapIds = [
  "be99602fc02d448eb859a0b426c0d5b6",
  "b6517d264b8f467fa5b14c382dfdf87a",
  "c5773442e91c48c392f28af6600169d0",
  "1bc7e98137fe44129dd6653bef1920d0",
  "287be80ff31d4c8babc48b2f959214f5",
  "4ee7ecad357844bba5b95001de39f1e3",
  "e5c6a086a5ae4d1991d4ca35733fe0ed",
];

// TODO ettevaatlikult üle toomine
const setupLayerListMain = (view) => {
  return new LayerList({
    view,
    container: "layers-container",
    listItemCreatedFunction: async (e) => {
      const item = e.item;

      await item.layer.when();

      // Slider settings
      const [itemPanelDiv, sliderDiv] = setupSliderStyle(item);

      // Legend settings
      const legendDiv = setupLegendStyle();
      setupLegend(view, item.layer, legendDiv);

      itemPanelDiv.append(sliderDiv, legendDiv);

      if (
        item.title === "Kataster" ||
        item.title === "Kitsendused" ||
        item.title === "Kitsendusi põhjustavad objektid" ||
        item.title === "Geoloogia WMS"
      ) {
        item.hidden = true;
      }

      // TODO kui muuta legendi overflow dünaamiliselt peaks ilmselt trigger-actioni itempaneldivile kirjutama, mis vastavalt muudab viewporti
      if (
        item.layer.type !== "group" ||
        item.title === "Taimkate analüütiline" ||
        item.title === "Taimkate realistlik"
      ) {
        item.panel = {
          content: itemPanelDiv,
          className: "esri-icon-legend",
          open: false,
          title: "Legend and layer opacity",
        };
      }

      sliderDiv.addEventListener("calciteSliderInput", () => {
        const value = sliderDiv.value / 100;
        item.layer.opacity = value;
      });

      // Common section for both conditions

      if (item.layer.type !== "group") {
        item.actionsSections = [
          [
            {
              title: "Layer information",
              className: "esri-icon-description",
              id: "information",
            },
          ],
        ];
      }

      const extentsNeeded = [
        "Nõmme",
        "Pärnu",
        "Tallinn",
        "Tartu",
        "Kuressaare",
        "Kohtuhoone tekstuuriga (Tallinn)",
      ];
      if (extentsNeeded.includes(item.title)) {
        item.actionsSections.items[0].push({
          title: "Zoom to extent",
          className: "esri-icon-zoom-out-fixed",
          id: "zoomTo",
        });
      }
    },
  });
};

const setupLayerListWMS = (view) => {
  return new LayerList({
    view,
    container: "wms-layers-container",
    listItemCreatedFunction: async (e) => {
      const item = e.item;

      await item.layer.when();

      // Slider settings
      const [itemPanelDiv, sliderDiv] = setupSliderStyle(item);

      // Legend settings
      const legendDiv = setupLegendStyle();
      setupLegend(view, item.layer, legendDiv);

      itemPanelDiv.append(sliderDiv, legendDiv);

      if (
        item.title !== "Kataster" &&
        item.title !== "Kitsendused" &&
        item.title !== "Kitsendusi põhjustavad objektid" &&
        item.title !== "Geoloogia WMS"
      ) {
        item.hidden = true;
      }

      if (item.layer.type !== "group") {
        item.panel = {
          content: itemPanelDiv,
          className: "esri-icon-legend",
          open: false,
          title: "Legend and layer opacity",
        };
      }
      // when the item is the name of the tree,
      // add the layers of the items to the group layer

      sliderDiv.addEventListener("calciteSliderInput", () => {
        const value = sliderDiv.value / 100;
        item.layer.opacity = value;
      });

      if (item.title !== "Geoloogia WMS") {
        item.actionsSections = [
          [
            {
              title: "Layer information",
              className: "esri-icon-description",
              id: "information",
            },
          ],
        ];
      }
    },
  });
};

const setupElevationExpand = (view, content, container = null) => {
  return new Expand({
    view,
    content,
    container,
  });
};

const setupExpand = (
  toolTipText,
  view,
  content,
  expanded,
  group,
  expandIcon = null,
  container = null
) => {
  return new Expand({
    expandTooltip: toolTipText,
    view,
    content,
    expanded,
    group,
    expandIcon,
    container,
  });
};

const setupBasemapGallery = (view) => {
  return new BasemapGallery({
    view,
    container: "basemaps-container",
    icon: "layer-basemap",
    source: basemapIds.map(
      (id) =>
        new Basemap({
          portalItem: {
            id,
          },
        })
    ),
  });
};

const loadWMStile = (basemaps, view) => {

  basemaps.watch("activeBasemap", () => {
    const isOrtofoto = basemaps.activeBasemap.title === "Ortofoto";

    view.watch("zoom", () => {
      view.map.layers.forEach((layer) => {
        if (layer.title === "Ortofoto WMS") {
          layer.visible = isOrtofoto && view.zoom >= 12.5;
        }
      });
    });

  });
};

const getLayerInfo = (layerList, view) => {
  layerList.on("trigger-action", (e) => {
    const layer = e.item.layer;

    // Capture the action id.
    const id = e.action.id;

    if (id === "information") {
      // If the information action is triggered, then
      // open the item details page of the service layer.
      window.open(layer.url);
    }

    if (id === "zoomTo") {
      view.goTo(layer.fullExtent.extent);
    }
  });
};

export {
  setupLayerListMain,
  setupLayerListWMS,
  setupElevationExpand,
  setupExpand,
  setupBasemapGallery,
  loadWMStile,
  getLayerInfo,
};
