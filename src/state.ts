export const state = {
  currRenderDom: null as string | HTMLElement | null,
  currelRectification: "",
  currelRectificationLevel: "" as string | number,
  currelRectificationIsKeepRatio: "" as string | boolean,
  resizeListener: null as EventListenerOrEventListenerObject | null,
  timer: null as number | null,
  currScale: 1,
  isElRectification: false,
  isAutofitRunning: false
};
