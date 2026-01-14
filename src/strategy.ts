import { state } from "./state";
import { AutofitOption, IgnoreOption } from "./types";

export function keepFit(
  dw: number,
  dh: number,
  dom: HTMLElement,
  ignore: AutofitOption['ignore'],
  limit: number,
  cssMode: AutofitOption['cssMode'] = "scale"
) {
  const clientHeight = document.documentElement.clientHeight;
  const clientWidth = document.documentElement.clientWidth;
  state.currScale = clientWidth / clientHeight < dw / dh ? clientWidth / dw : clientHeight / dh;
  state.currScale = Math.abs(1 - state.currScale) > limit ? state.currScale : 1;

  const height = Math.round(clientHeight / Number(state.currScale));
  const width = Math.round(clientWidth / Number(state.currScale));

  dom.style.height = `${height}px`;
  dom.style.width = `${width}px`;

  if (cssMode === "zoom") {
    (dom.style as any).zoom = `${state.currScale}`;
  } else {
    dom.style.transform = `translateZ(0) scale(${state.currScale})`;
  }

  const ignoreStyleDOM = document.querySelector("#ignoreStyle")!;
  ignoreStyleDOM.innerHTML = "";

  for (const temp of ignore!) {
    const item = temp as IgnoreOption & { dom: string };
    let itemEl = item.el || item.dom;
    typeof item == "string" && (itemEl = item);

    if (!itemEl || (typeof itemEl === "object" && !Object.keys(itemEl).length)) {
      console.error(`autofit: found invalid or empty selector/object: ${itemEl}`);
      continue;
    }

    const realScale: number = item.scale ? item.scale : 1 / Number(state.currScale);
    const realFontSize = realScale != state.currScale && item.fontSize;
    const realWidth = realScale != state.currScale && item.width;
    const realHeight = realScale != state.currScale && item.height;

    ignoreStyleDOM.innerHTML += `\n${itemEl} { 
      transform: scale(${realScale})!important;
      transform-origin: 0 0;
      ${realWidth ? `width: ${realWidth}!important;` : ''}
      ${realHeight ? `height: ${realHeight}!important;` : ''}
    }`;

    if (realFontSize) {
      ignoreStyleDOM.innerHTML += `\n${itemEl} div ,${itemEl} span,${itemEl} a,${itemEl} * {
        font-size: ${realFontSize}px;
      }`;
    }
  }
}
