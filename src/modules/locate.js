import Locate from "@arcgis/core/widgets/Locate.js";

const setupLocate = (view) => {
  return new Locate({
    view,
  });
};

export { setupLocate };
