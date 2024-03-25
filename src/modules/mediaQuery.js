const handleMediaQueryChange = (mql) => {
  const calciteActionBars = document.querySelectorAll("calcite-action");
  if (mql.matches) {
    calciteActionBars.forEach((bar) => {
      console.log(bar);
      bar.scale = "m";
    });
  }
};

export { handleMediaQueryChange };
