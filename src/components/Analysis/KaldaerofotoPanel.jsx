import React, { useState, useEffect } from "react";
import Modal from "react-modal";

import { customStyles } from "./ModalMap.module";

Modal.setAppElement("#root");

export const KaldaerofotoPanel = ({ kaldfotoPanelOpen, kaldCoordinates }) => {
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Update state only if the prop changes
    setIsOpen(kaldfotoPanelOpen);
  }, [kaldfotoPanelOpen]);

  const closeModal = () => {
    setIsOpen(false);
  };

  const { x, y } = kaldCoordinates || {};

  return (
    <div data-panel-id="kaldfoto">
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        onRequestClose={closeModal}
        contentLabel="Kaldfoto Modal"
      >
        {x && y && (
          <iframe
            width="99%"
            height="99%"
            src={`https://fotoladu.maaamet.ee/etak.php?x=${x}&y=${y}&view4`}
          />
        )}
      </Modal>
    </div>
  );
};
