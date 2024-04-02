import React, { useState, useEffect } from "react";
import Modal from "react-modal";

import { customStyles } from "./XGISMapPanel.module";

Modal.setAppElement("#root");

export const XGISMapPanel = ({ xgisPanelOpen, share2dCoordinates }) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Update state only if the prop changes
    setIsOpen(xgisPanelOpen);
  }, [xgisPanelOpen]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const { xmin, ymin, xmax, ymax } = share2dCoordinates || {};

  return (
    <div data-panel-id="x-gis-map">
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        onRequestClose={closeModal}
        contentLabel="X-GIS Modal"
      >
        {xmin && ymin && xmax && ymax && (
          <iframe
            width="99%"
            height="99%"
            id="xGisMap"
            src={`https://xgis.maaamet.ee/xgis2/page/app/maainfo?bbox=${xmin},${ymin},${xmax},${ymax}`}
          />
        )}
      </Modal>
    </div>
  );
};
