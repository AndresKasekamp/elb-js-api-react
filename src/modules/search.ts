import Search from "@arcgis/core/widgets/Search.js";
import SearchSource from "@arcgis/core/widgets/Search/SearchSource.js";
import Graphic from "@arcgis/core/Graphic.js";
import Point from "@arcgis/core/geometry/Point.js";

import esriRequest from "@arcgis/core/request.js";

import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import SceneView from "@arcgis/core/views/SceneView.js";

interface Address {
  pikkaadress: string;
  unik: string;
  viitepunkt_l: number;
  viitepunkt_b: number;
}

const inAdsUrl: string = "http://inaadress.maaamet.ee/inaadress/gazetteer/";

export const setupCustomSearchSource = () => {
  return new SearchSource({
    placeholder: "Search address",
    getSuggestions: async (params) => {
      const keyword = params.suggestTerm;
      const suggestUrl = `${inAdsUrl}?address=${encodeURIComponent(keyword)}`;
      const results = await esriRequest(suggestUrl, { responseType: "json" });
      return results.data.addresses.map((address: Address) => {
        return {
          text: address.pikkaadress,
          magicKey: address.unik,
        };
      });
    },
    getResults: async (params) => {
      const key = params.suggestResult.text;
      const newUrl = `${inAdsUrl}?address=${encodeURIComponent(key)}`;
      const results = await esriRequest(newUrl, { responseType: "json" });
      const searchResults = results.data.addresses.map((address: Address) => {
        const graphic = new Graphic({
          geometry: new Point({
            x: address.viitepunkt_l,
            y: address.viitepunkt_b,
          }),
        });
        const buffer = geometryEngine.geodesicBuffer(
          graphic.geometry,
          30,
          "meters"
        );
        const searchResult = {
          // @ts-expect-error - weird buffer types
          extent: buffer.extent,
          feature: graphic,
          name: `${address.pikkaadress}`,
        };
        return searchResult;
      });
      return searchResults;
    },
  });
};

export const setupSearchWidget = (view: SceneView, sources: SearchSource) => {
  return new Search({
    view: view,
    sources: [sources],
    includeDefaultSources: false,
    container: "in-ads-container",
  });
};
