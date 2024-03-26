import "@esri/calcite-components/dist/components/calcite-slider.js";
import { CalciteSlider } from "@esri/calcite-components-react";

import LayerList from "@arcgis/core/widgets/LayerList.js";

import SceneView from "@arcgis/core/views/SceneView.js";

import Legend from "@arcgis/core/widgets/Legend.js";

import Layer from "@arcgis/core/layers/Layer.js";
import { useState } from "react";

export const setupLayerListMain2 = (view: SceneView) => {
  return new LayerList({
    view,
    container: "layers-container",
    listItemCreatedFunction: async (e) => {
      const item = e.item;

      await item.layer.when();


      


    //   setupLegend(view, item.layer, item.uid + "_legend");

      if (
        item.title === "Kataster" ||
        item.title === "Kitsendused" ||
        item.title === "Kitsendusi põhjustavad objektid" ||
        item.title === "Geoloogia WMS"
      ) {
        item.hidden = true;
      }

      if (
        item.layer.type !== "group" ||
        item.title === "Taimkate analüütiline" ||
        item.title === "Taimkate realistlik"
      ) {
        item.panel = {
          content: <SetupSliderStyle2 uid={item.uid} item={item} />,
          className: "esri-icon-legend",
          open: false,
          title: "Legend and layer opacity",
        };
      }

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

// @ts-expect-error - something
const SetupSliderStyle2 = ({ uid, item }) => {
  const [sliderValue, setSliderValue] = useState(100);

  // @ts-expect-error - something
  const handleSliderChanges = (e) => {
    const newValue = e.target.value;
    setSliderValue(newValue);
    item.layer.opacity = newValue / 100;
  };

  return (
    <div id={uid} key={uid}>
      <CalciteSlider
        min={0}
        max={100}
        step={1}
        value={sliderValue}
        labelHandles={true}
        onCalciteSliderInput={handleSliderChanges}
      />
      {/* <div
        id={uid + "_legend"}
        key={uid + "_legend"}
        className="esri-widget"
      ></div> */}
    </div>
  );
};

const setupLegend = (
  view: SceneView,
  layer: Layer,
  container: string | HTMLElement | undefined
) => {
  return new Legend({
    view: view,
    layerInfos: [
      {
        layer,
      },
    ],
    container,
  });
};


