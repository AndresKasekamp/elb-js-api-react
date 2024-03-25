import Slice from "@arcgis/core/widgets/Slice.js";

const setupSlice = (view) => {
  return new Slice({
    view: view,
    container: "slicing-container",
  });
};

export { setupSlice };
