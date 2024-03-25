import Daylight from "@arcgis/core/widgets/Daylight.js";

const setupDaylight = (view) => {
  return new Daylight({
    view,
    visible: true,
    container: "daylight-container",
  });
};

export { setupDaylight };
