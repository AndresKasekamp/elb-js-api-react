/* eslint-disable @typescript-eslint/ban-ts-comment */
// TODO kui tööle saad, siis interface ära muuta
// TODO või proovida sättida default sketch toolbar alguses (esri oma) ja ülejäänud jätta samaks, kuna see draw a building/draw pole optimaalne alati
// TODO typescript on vaja üle käia

import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import Slider from "@arcgis/core/widgets/Slider.js";
import SceneView from "@arcgis/core/views/SceneView.js";

import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import PolygonSymbol3D from "@arcgis/core/symbols/PolygonSymbol3D.js";
import LineSymbol3D from "@arcgis/core/symbols/LineSymbol3D.js";
import PointSymbol3D from "@arcgis/core/symbols/PointSymbol3D.js";

// Graphic UI parameters
const blue: number[] = [82, 82, 122, 0.9];
const white: number[] = [255, 255, 255, 0.8];
// polygon symbol used for sketching the extruded building footprints
const extrudedPolygon: PolygonSymbol3D = {
  type: "polygon-3d",
  // @ts-ignore: Object is possibly 'null'.
  symbolLayers: [
    {
      type: "extrude",
      size: 10, // extrude by 10 meters
      material: {
        color: white,
      },
      edges: {
        type: "solid",
        size: "3px",
        color: blue,
      },
    },
  ],
};

// polyline symbol used for sketching routes
const route: LineSymbol3D = {
  type: "line-3d",
  // @ts-ignore: Object is possibly 'null'.
  symbolLayers: [
    {
      type: "line",
      size: "10px",
      material: {
        color: white,
      },
    },
    {
      type: "line",
      size: "3px",
      material: {
        color: blue,
      },
    },
  ],
};

// point symbol used for sketching points of interest
const point: PointSymbol3D = {
  type: "point-3d",
  // @ts-ignore: Object is possibly 'null'.
  symbolLayers: [
    {
      type: "icon",
      size: "30px",
      resource: { primitive: "kite" },
      outline: {
        color: blue,
        size: "3px",
      },
      material: {
        color: white,
      },
    },
  ],
};

export const setupSketch = (view: SceneView, graphicsLayer: GraphicsLayer) => {
  /**************************************
   * Sketching (1): Init settings
   **************************************/
  // Set-up event handlers for buttons and click events
  const startbuttons = document.getElementById("startbuttons");
  const actionbuttons = document.getElementById("actionbuttons");
  const edgeoperationbuttons = document.getElementById("edgeoperationbuttons");

  const extrudeSliderButton = document.getElementById("extrudeSliderContainer");

  const extrudeSlider = new Slider({
    container: "extrudeSlider",
    precision: 1,
    min: 0,
    max: 500,
    steps: 1,
    values: [10],
    visibleElements: {
      rangeLabels: true,
    },
  });

  const sketchViewModel = new SketchViewModel({
    layer: graphicsLayer,
    view,
    pointSymbol: point,
    polygonSymbol: extrudedPolygon,
    polylineSymbol: route,
    defaultCreateOptions: {
      hasZ: true, // default value
    },
    snappingOptions: {
      enabled: true,
      featureSources: [{ layer: graphicsLayer }],
    },
    tooltipOptions: { enabled: true },
    labelOptions: { enabled: true },
    defaultUpdateOptions: {
      tool: "transform",
      enableScaling: true,
      enableZ: true,
    },
  });

  sketchViewModel.on("create", (event) => {
    if (event.state === "complete") {
      // @ts-ignore: Object is possibly 'null'.
      startbuttons.style.display = "inline";
      // @ts-ignore: Object is possibly 'null'.
      actionbuttons.style.display = "none";
      sketchViewModel.update(event.graphic);
    }
    if (event.state === "cancel") {
      // @ts-ignore: Object is possibly 'null'.
      startbuttons.style.display = "inline";
      // @ts-ignore: Object is possibly 'null'.
      actionbuttons.style.display = "none";
    }
  });

  sketchViewModel.on("update", (event) => {
    if (event.state === "start") {
      // @ts-ignore: Object is possibly 'null'.
      startbuttons.style.display = "none";
      // @ts-ignore: Object is possibly 'null'.
      actionbuttons.style.display = "inline";

      if (
        event.graphics[0].geometry.type === "polygon" ||
        event.graphics[0].geometry.type === "polyline"
      ) {
        // @ts-ignore: Object is possibly 'null'.
        edgeoperationbuttons.style.display = "inline";
      }
      if (event.graphics[0].geometry.type === "polyline") {
        // @ts-ignore: Object is possibly 'null'.
        extrudeSliderButton.style.display = "none";
      }
    }
    if (event.state === "complete") {
      // @ts-ignore: Object is possibly 'null'.
      startbuttons.style.display = "inline";
      // @ts-ignore: Object is possibly 'null'.
      actionbuttons.style.display = "none";
      // @ts-ignore: Object is possibly 'null'.
      edgeoperationbuttons.style.display = "none";
    }
  });

  /**********************************************
   * Sketching (2): Drawing UI with configuration
   *********************************************/

  const drawButtons = Array.prototype.slice.call(
    document.getElementsByClassName("starttool")
  );
  const cancelBtn = document.getElementById("cancel");
  const doneBtn = document.getElementById("done");

  // set event listeners to activate sketching graphics
  drawButtons.forEach((btn) => {
    btn.addEventListener("click", (event: MouseEvent) => {
      // to activate sketching the create method is called passing in the geometry type
      // from the data-type attribute of the html element
      // @ts-ignore: Object is possibly 'null'.
      sketchViewModel.create(event.target.getAttribute("data-type"));
      // @ts-ignore: Object is possibly 'null'.
      startbuttons.style.display = "none";
      // @ts-ignore: Object is possibly 'null'.
      actionbuttons.style.display = "inline";
    });
  });

  // @ts-ignore: Object is possibly 'null'.
  cancelBtn.addEventListener("click", () => {
    sketchViewModel.cancel();
  });
  // @ts-ignore: Object is possibly 'null'.
  doneBtn.addEventListener("click", () => {
    if (sketchViewModel.updateGraphics.length !== 0) {
      sketchViewModel.complete();
    } else {
      sketchViewModel.cancel();
    }
  });

  // Update the building layer extrusion
  // @ts-ignore: Object is possibly 'null'.
  extrudeSlider.on(["thumb-change", "thumb-drag"], extrudeSizeChanged);

  // @ts-ignore: Object is possibly 'null'.
  function extrudeSizeChanged(event) {
    const value = event.value;
    // @ts-ignore: Object is possibly 'null'.
    document.getElementById("extrude").innerHTML = value;
    const extrudedPolygon = sketchViewModel.layer.graphics.getItemAt(
      sketchViewModel.layer.graphics.length - 1
    );
    // @ts-ignore: Object is possibly 'null'.
    const updatedSymbol = extrudedPolygon.symbol.clone();
    updatedSymbol.symbolLayers.items[0].size = value;
    extrudedPolygon.symbol = updatedSymbol;
  }

  // default values for edge/move operations
  let edgeType = "split";
  let shapeType = "move";

  // Handling the configuration for edge operation
  const noneEdgeBtn = document.getElementById("none-edge-button");
  const splitEdgeBtn = document.getElementById("split-edge-button");
  const offsetEdgeBtn = document.getElementById("offset-edge-button");
  // @ts-ignore: Object is possibly 'null'.
  noneEdgeBtn.onclick = edgeChangedClickHandler;
  // @ts-ignore: Object is possibly 'null'.
  splitEdgeBtn.onclick = edgeChangedClickHandler;
  // @ts-ignore: Object is possibly 'null'.
  offsetEdgeBtn.onclick = edgeChangedClickHandler;

  function edgeChangedClickHandler(event: MouseEvent) {
    // @ts-ignore: Object is possibly 'null'.
    edgeType = event.target.value;

    // handle the buttons
    const buttons = document.getElementsByClassName("edge-button");
    for (const button of buttons) {
      button.classList.remove("edge-button-selected");
    }
    // @ts-ignore: Object is possibly 'null'.
    this.classList.add("edge-button-selected");
    restartUpdateMode({
      reshapeOptions: {
        edgeOperation: edgeType,
        shapeOperation: shapeType,
      },
    });
  }

  // Handling the configuration for move operation
  const noneShapeButton = document.getElementById("none-shape-button");
  const moveShapeButton = document.getElementById("move-shape-button");
  // @ts-ignore: Object is possibly 'null'.
  noneShapeButton.onclick = shapeChangedClickHandler;
  // @ts-ignore: Object is possibly 'null'.
  moveShapeButton.onclick = shapeChangedClickHandler;

  function shapeChangedClickHandler(event: MouseEvent) {
    // @ts-ignore: Object is possibly 'null'.
    shapeType = event.target.value;

    // handle the buttons
    const buttons = document.getElementsByClassName("shape-button");
    for (const button of buttons) {
      button.classList.remove("shape-button-selected");
    }
    // @ts-ignore: Object is possibly 'null'.
    this.classList.add("shape-button-selected");
    restartUpdateMode({
      reshapeOptions: {
        edgeOperation: edgeType,
        shapeOperation: shapeType,
      },
    });
  }

  // @ts-ignore: Object is possibly 'null'.
  function restartUpdateMode(updateOptions) {
    sketchViewModel.defaultUpdateOptions = {
      ...sketchViewModel.defaultUpdateOptions,
      ...updateOptions,
    };

    if (sketchViewModel.activeTool) {
      if (
        sketchViewModel.activeTool === "transform" ||
        sketchViewModel.activeTool === "move" ||
        sketchViewModel.activeTool === "reshape"
      ) {
        updateOptions.tool = sketchViewModel.activeTool;
        sketchViewModel.update(
          sketchViewModel.updateGraphics.toArray(),
          updateOptions
        );
      }
    }
  }
};
