import ElevationProfile from "@arcgis/core/widgets/ElevationProfile.js";
import SceneView from "@arcgis/core/views/SceneView.js";

export const setupElevationProfile = (view: SceneView) => {
  return new ElevationProfile({
    view,
    container: "elevation-profile-container",
    profiles: [
      {
        type: "ground",
        title: "Maapind",
      },
      {
        type: "view",
        title: "Kihid",
      },
    ],
    visibleElements: {
      selectButton: true,
    },
  });
};
