import Search from "@arcgis/core/widgets/Search.js";
import SearchSource from "@arcgis/core/widgets/Search/SearchSource.js";
import Graphic from "@arcgis/core/Graphic.js";
import Point from "@arcgis/core/geometry/Point.js";
import esriRequest from "@arcgis/core/request.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";

const inAdsUrl = "http://inaadress.maaamet.ee/inaadress/gazetteer/";

const setupCustomSearchSource = () => {
  return new SearchSource({
    placeholder: "Search address",
    getSuggestions: async (params) => {
      const keyword = params.suggestTerm;
      const suggestUrl = `${inAdsUrl}?address=${encodeURIComponent(keyword)}`;
      const results = await esriRequest(suggestUrl, { responseType: "json" });
      return results.data.addresses.map((address) => {
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
      const searchResults = results.data.addresses.map((address) => {
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

const setupSearchWidget = (view, sources) => {
  return new Search({
    view: view,
    sources: [sources],
    includeDefaultSources: false,
    container: "in-ads-container",
  });
};

export { setupCustomSearchSource, setupSearchWidget };
