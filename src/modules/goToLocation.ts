import Viewpoint from "@arcgis/core/Viewpoint.js";
import Camera from "@arcgis/core/Camera.js";
import Point from "@arcgis/core/geometry/Point.js";
import SceneView from "@arcgis/core/views/SceneView.js";

// TODO siin on väga palju state asju, mida tasuks üle vaadata

const getUndergroundInfo = (view: SceneView) => {
  const urlString = new URL(window.location.href);
  const url = new URLSearchParams(urlString.search);
  const undergroundParam = url.get("underground");
  if (undergroundParam === "true") {
    // Changing visualisation and settings in back end
    // const navigateUndergroundInput = document.getElementById(
    //   "navigationUnderground"
    // );
    // navigateUndergroundInput.checked = true;
    view.map.ground.navigationConstraint.type = "none";
    return true
  }
  return undefined
};

// TODO ts üle vaadata siin
const getLayerVisibility = (view: SceneView) => {
  const urlString = new URL(window.location.href);
  const url = new URLSearchParams(urlString.search);
  const layersParamStr = url.get("layers");
  if (layersParamStr !== null) {
    const layersParamArr = layersParamStr.split(",");
    // @ts-expect-error - ts does not about items
    view.map.allLayers.items.forEach((obj) => {
      if (layersParamArr.includes(obj.title)) {
        obj.visible = !obj.visible;
      }
    });
  }
};

// TODO see komponent ümber teha
const getElevationVisibility = (view: SceneView) => {
  const urlString = new URL(window.location.href);
  const url = new URLSearchParams(urlString.search);
  const layersParamStr = url.get("elevation");
  if (layersParamStr !== null) {
    const layersParamArr = layersParamStr.split(",");

    let checkedElevation
    // Front end
    layersParamArr.forEach((obj) => {
      if (obj === "Kõrgusmudel") {
        checkedElevation = "dtmElevation"
        // const elevationModel = document.getElementById("dtmElevation");
        // elevationModel.checked = "false";
      } else if (obj === "Aluspõhi 50m") {
        checkedElevation = "apElevation"
        // const elevationModel = document.getElementById("apElevation");
        // elevationModel.checked = "true";
      } else if (obj === "Aluskord 50m") {
        checkedElevation = "akElevation"
        // const elevationModel = document.getElementById("akElevation");
        // elevationModel.checked = "true";
      }
    });

    // Back end
    view.map.ground.layers.forEach((obj) => {
      if (layersParamArr.includes(obj.title)) {
        obj.visible = !obj.visible;
      }
    });

    return checkedElevation
  }

  return "dtmElevation"
};

const getLocation = () => {
  const urlString = new URL(window.location.href);
  const url = new URLSearchParams(urlString.search);
  const viewpointParam = url.get("view");
  if (viewpointParam) {
    const [x, y, z, heading, tilt, rotation, scale] = viewpointParam.split(",");
    const parsedX = parseFloat(x);
    const parsedY = parseFloat(y);
    const parsedZ = parseFloat(z);
    const parsedHeading = parseFloat(heading);
    const parsedTilt = parseFloat(tilt);
    const parsedRotation = parseFloat(rotation);
    const parsedScale = parseFloat(scale);
    return [
      parsedX,
      parsedY,
      parsedZ,
      parsedHeading,
      parsedTilt,
      parsedRotation,
      parsedScale,
    ];
  }
  return null;
};

const copyTextToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

// TODO elevation layer visibility määramine üle vaadata, praegu on ebaloogiline arrays hoida
const createURL = (view: SceneView, regularLayers: string[], elevationLayers: string[]) => {
  const currentURL = window.location.href;
  const urlWithoutParams = new URL(currentURL.split("?")[0]);
  const viewpoint = view.viewpoint;
  const { rotation, scale } = viewpoint;
  const { heading, tilt } = viewpoint.camera;
  const { x, y, z } = viewpoint.camera.position;
  const queryParams = new URLSearchParams();
  queryParams.set(
    "view",
    `${x},${y},${z},${heading},${tilt},${rotation},${scale}`
  );
  if (view.map.ground.navigationConstraint.type === "none") {
    queryParams.set("underground", "true");
  }
  if (regularLayers.length !== 0) {
    const regularLayerVisibilityJoined = regularLayers.join(",");
    queryParams.set("layers", regularLayerVisibilityJoined);
  }
  if (elevationLayers.length !== 0) {
    const elevationLayerVisibilityJoined = elevationLayers.join(",");
    queryParams.set("elevation", elevationLayerVisibilityJoined);
  }
  urlWithoutParams.search = queryParams.toString();
  return urlWithoutParams.toString();
};

const setupViewPoint = (locationArray: number[]) => {
  const [
    locationX,
    locationY,
    locationZ,
    locationHeading,
    locationTilt,
    locationRotate,
    locationScale,
  ] = locationArray;
  const viewpoint = new Viewpoint({
    camera: new Camera({
      position: new Point({
        x: locationX,
        y: locationY,
        z: locationZ,
        spatialReference: {
          wkid: 3301,
        },
      }),
      heading: locationHeading,
      tilt: locationTilt,
    }),
    rotation: locationRotate,
    scale: locationScale,
  });
  return viewpoint;
};

export {
  getUndergroundInfo,
  getLayerVisibility,
  getElevationVisibility,
  getLocation,
  copyTextToClipboard,
  createURL,
  setupViewPoint,
};
