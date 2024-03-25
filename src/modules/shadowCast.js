import ShadowCast from "@arcgis/core/widgets/ShadowCast.js";

const setupShadowCast = (view) => {
  return new ShadowCast({
    view: view,
    visible: false,
    container: "shadowcast-container",
  });
};

export { setupShadowCast };
