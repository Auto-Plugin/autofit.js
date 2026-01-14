import { state } from "./state";

export function elRectification(el: string, isKeepRatio: string | boolean = true, level: string | number = 1) {
  if (!state.isAutofitRunning) {
    console.error("autofit.js：(elRectification): autofit has not been initialized yet");
    return;
  }
  offelRectification();
  !el && console.error(`autofit.js：elRectification bad selector: ${el}`);
  state.currelRectification = el;
  state.currelRectificationLevel = level;
  state.currelRectificationIsKeepRatio = isKeepRatio;
  const currEl = Array.from(document.querySelectorAll<HTMLElement & { originalWidth: number, originalHeight: number }>(el));
  if (currEl.length == 0) {
    console.error(`autofit.js：elRectification found no element by selector: "${el}"`);
    return;
  }
  for (const item of currEl) {
    const rectification = state.currScale == 1 ? 1 : Number(state.currScale) * Number(level);
    if (!state.isElRectification) {
      item.originalWidth = item.clientWidth;
      item.originalHeight = item.clientHeight;
    }
    if (isKeepRatio) {
      item.style.width = `${item.originalWidth * rectification}px`;
      item.style.height = `${item.originalHeight * rectification}px`;
    } else {
      item.style.width = `${100 * rectification}%`;
      item.style.height = `${100 * rectification}%`;
    }
    item.style.transform = `translateZ(0) scale(${1 / Number(state.currScale)})`;
    item.style.transformOrigin = `0 0`;
  }
  state.isElRectification = true;
}

export function offelRectification() {
  if (!state.currelRectification) return;
  state.isElRectification = false;
  for (const item of Array.from(document.querySelectorAll<HTMLElement>(state.currelRectification))) {
    item.style.width = ``;
    item.style.height = ``;
    item.style.transform = ``;
  }
}
