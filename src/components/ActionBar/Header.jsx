import React from "react";
import { EtakSearch } from "./EtakSearch";

export const Header = ({ view }) => {
  return (
    <header slot="header" id="header">
      <h2 id="header-title">Maa- ja Ruumiamet 3D</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        {view && <EtakSearch view={view} />}
        <div key="in-ads-container" id="in-ads-container"></div>
      </div>
    </header>
  );
};
