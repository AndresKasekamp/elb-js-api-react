// TODO ürita Maa-ameti DSM/CHM alla tuua?
import ElevationProfile from "@arcgis/core/widgets/ElevationProfile.js";

const setupElevationProfile = (view) => {
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

export { setupElevationProfile };
