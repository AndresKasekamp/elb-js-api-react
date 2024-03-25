import LineOfSight from "@arcgis/core/widgets/LineOfSight.js";

const setupLoS = (view) => {
  return new LineOfSight({
    view,
    container: "line-of-sight-container",
  });
};

const getStartPoint = (view) => {
  const losStartBtn = document.getElementById("LoSstartBtn");

  losStartBtn.addEventListener("click", (e) => {
    //e.preventDefault();
    // Get values from the form
    const xLOSstartValue = document.getElementById("xLOSstart").value;
    const yLOSstartValue = document.getElementById("yLOSstart").value;
    const zLOSstartValue = document.getElementById("zLoSstart").value;

    // Log the values (You can perform any desired action here)
    console.log("X-coordinate:", xLOSstartValue);
    console.log("Y-coordinate:", yLOSstartValue);
    console.log("Z-coordinate:", zLOSstartValue);
  });
};

export { setupLoS, getStartPoint };
