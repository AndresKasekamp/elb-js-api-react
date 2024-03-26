import React from "react";

import "@esri/calcite-components/dist/components/calcite-alert.js";

import { CalciteAlert } from "@esri/calcite-components-react";

export const ShareMapAlert = ({shareOpen}) => {
  return (
    <CalciteAlert
      id="share-map-alert"
      label="share-map-alert"
      auto-close
      auto-close-duration="fast"
      open={shareOpen ? true : undefined}
      kind="success"
    >
      <div slot="message">Copied map location to the clipboard</div>
    </CalciteAlert>
  );
};
