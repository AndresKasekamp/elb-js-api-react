// TODO seda peab modulariseerima veits
import "@esri/calcite-components/dist/components/calcite-input-text.js";
import "@esri/calcite-components/dist/components/calcite-alert.js";

import { CalciteInputText, CalciteAlert } from "@esri/calcite-components-react";
import { useState, useEffect } from "react";
import Viewpoint from "@arcgis/core/Viewpoint.js";
import Camera from "@arcgis/core/Camera.js";
import Point from "@arcgis/core/geometry/Point.js";
import Graphic from "@arcgis/core/Graphic.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";

const constructEtakIdLocation = (x, y) => {
  const viewpoint = new Viewpoint({
    camera: new Camera({
      position: new Point({
        x,
        y,
        z: 300,
        spatialReference: {
          wkid: 3301,
        },
      }),
    }),
  });
  return viewpoint;
};

const calculatePolygonCentroid = (coordinates) => {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  const vertices = coordinates[0]; // Assuming GeoJSON polygon format: [[[x, y], [x, y], ...]]]

  let area = 0;
  let x = 0;
  let y = 0;
  const n = vertices.length;

  for (let i = 0; i < n; i++) {
    const xi = vertices[i][0];
    const yi = vertices[i][1];
    const nexti = (i + 1) % n;
    const xnext = vertices[nexti][0];
    const ynext = vertices[nexti][1];
    const cross = xi * ynext - xnext * yi;
    area += cross;
    x += (xi + xnext) * cross;
    y += (yi + ynext) * cross;
  }

  area /= 2;

  if (area === 0) {
    return null; //Polygon has no area.
  }

  return { x: x / (6 * area), y: y / (6 * area) };
};

const fetchData = async (etak_id) => {
  const url = `https://gsavalik.envir.ee/geoserver/wfs?typename=etak:e_401_hoone_ka&service=wfs&srs=EPSG:3301&request=getfeature&outputformat=json&cql_filter=etak_id=${etak_id}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Network connection error");
    }

    const data = await response.json();
    return data.features[0].geometry.coordinates;
  } catch (error) {
    console.error("Request error");
  }
};

export const EtakIdAlert = ({ alertOpen }) => {
  console.log("I AM HERE");
  return (
    <CalciteAlert
      id="etak-id-alert"
      label="etak-id-alert"
      auto-close
      auto-close-duration="fast"
      placement="top"
      open={alertOpen ? true : undefined}
      icon
      scale="s"
      kind="warning"
    >
      <div slot="title">Could not retrieve ETAK ID</div>
    </CalciteAlert>
  );
};

// TODO kui tühi response tuleb, siis sellega arvestada
export const EtakSearch = ({ view }) => {
  const [inputValue, setInputValue] = useState("");
  const [graphicsLayer, setGraphicsLayer] = useState(null);

  useEffect(() => {
    const layer = new GraphicsLayer();
    view.map.add(layer);
    setGraphicsLayer(layer);
  }, [view]);

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      const coordinates = await fetchData(inputValue);
      if (coordinates) {
        const centroid = calculatePolygonCentroid(coordinates);

        if (centroid) {
          const etakLocation = constructEtakIdLocation(centroid.x, centroid.y);
          view.goTo(etakLocation, { animate: false });

          // Create a point graphic and add it to the graphics layer
          const point = new Point({
            x: centroid.x,
            y: centroid.y,
            spatialReference: { wkid: 3301 },
          });

          const markerSymbol = {
            type: "simple-marker",
            color: [226, 119, 40], // Orange
            outline: {
              color: [255, 255, 255], // White
              width: 1,
            },
          };

          const pointGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol,
          });

          graphicsLayer.removeAll();
          graphicsLayer.add(pointGraphic);
        } else {
          console.error("Error calculating ETAK ID centroid");
        }
      }
    }
  };

  return (
    <CalciteInputText
      id="etakSeach"
      name="etakSearch"
      prefix-text="ETAK ID"
      clearable
      value={inputValue}
      onInput={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
    ></CalciteInputText>
  );
};
