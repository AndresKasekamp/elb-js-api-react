import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import SceneLayer from "@arcgis/core/layers/SceneLayer.js";
import WMSLayer from "@arcgis/core/layers/WMSLayer.js";
import GroupLayer from "@arcgis/core/layers/GroupLayer.js";

const setupGraphicsLayer = () => {
  return new GraphicsLayer({
    elevationInfo: { mode: "absolute-height" },
    title: "Joonistatud kihid",
  });
};

const setupInternalLayer = (id, title) => {
  return new SceneLayer({
    portalItem: {
      id,
    },
    title,
  });
};

const setupWMSLayer = () => {
  return new WMSLayer({
    portalItem: {
      id: "38a98f83f3a248faaea9ce793e50ddee",
    },
    title: "Ortofoto WMS",
    visible: false,
    listMode: "hide",
  });
};

const setupGroupLayer = (title, visibilityMode, visible = false) => {
  return new GroupLayer({
    title,
    visible,
    visibilityMode,
  });
};

const taimkateWorkaround = (treeGroupLayer, view) => {
  const taimkateAnalytical = view.map.allLayers.find(
    (layer) => layer.title === "Taimkate analüütiline"
  );
  taimkateAnalytical.visible = true;

  const taimkateRealistic = view.map.allLayers.find(
    (layer) => layer.title === "Taimkate realistlik"
  );

  treeGroupLayer.addMany([taimkateAnalytical, taimkateRealistic]);
  view.map.removeMany([taimkateAnalytical, taimkateRealistic]);
};

const getGeologyLayers = (view) => {
  const geologyLayerTitles = [
    "Andmepunktid",
    "Puurkaevud/puuraugud", // DEPRECATED, inside Andmepunktid for now
    "Ehitusgeoloogia",
    "Geoloogia WMS",
  ];

  const geologyLayers = {};
  view.map.layers.forEach((layer) => {
    const layerTitle = layer.title;
    if (geologyLayerTitles.includes(layerTitle)) {
      geologyLayers[layerTitle] = layer;
    }
  });

  const returnLayers = geologyLayerTitles
    .map((title) => geologyLayers[title])
    .filter(Boolean);
  return { items: returnLayers };
};

const getVisibleLayers = (view) => {
  const { items } = view.map.allLayers;
  const { initVisible } = items.reduce(
    (acc, obj) => {
      if (obj.visible === true) {
        acc.initVisible.push(obj);
      }
      return acc;
    },
    { initVisible: [] }
  );

  return initVisible;
};

const compareVisibleLayers = (initVisibleLayers, visibleLayersCurrently) => {
  const difference1 = initVisibleLayers.filter(
    (item) => !visibleLayersCurrently.includes(item)
  );
  const difference2 = visibleLayersCurrently.filter(
    (item) => !initVisibleLayers.includes(item)
  );

  const getTitle = (obj) => obj.title;
  const layerVisibilityChanged = [
    ...difference1.map(getTitle),
    ...difference2.map(getTitle),
  ];

  const elevationTitles = ["Kõrgusmudel", "Aluspõhi 50m", "Aluskord 50m"];
  const regularLayers = layerVisibilityChanged.filter(
    (item) => !elevationTitles.includes(item)
  );
  const elevationChanged = layerVisibilityChanged.filter((item) =>
    elevationTitles.includes(item)
  );

  return [regularLayers, elevationChanged];
};

export {
  setupGraphicsLayer,
  setupInternalLayer,
  setupWMSLayer,
  setupGroupLayer,
  taimkateWorkaround,
  getGeologyLayers,
  getVisibleLayers,
  compareVisibleLayers,
};
