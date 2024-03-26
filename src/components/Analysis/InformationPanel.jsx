import React from "react";
import DOMPurify from "dompurify"; // Import DOMPurify
import "@esri/calcite-components/dist/components/calcite-panel.js";
import { CalcitePanel } from "@esri/calcite-components-react";

export const InformationPanel = ({ description }) => {
  const sanitizedDescription = DOMPurify.sanitize(description);

  return (
    <>
      <CalcitePanel
        id="information-panel"
        heading="Details"
        data-panel-id="information"
        hidden
      >
        <div id="info-content">
          <div
            id="item-description"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }} // Set inner HTML using dangerouslySetInnerHTML
          />
        </div>
      </CalcitePanel>
    </>
  );
};
