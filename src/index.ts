import { Autofit, AutofitOption } from './types';
import { state } from './state';
import { elRectification, offelRectification } from './rectification';
import { keepFit } from './strategy';

export type { AutofitOption, IgnoreOption } from './types';
export { elRectification };

const autofit: Autofit = {
  isAutofitRunning: false,

  init(options = {}, isShowInitTip = true) {
    if (isShowInitTip) {
      console.log(`autofit.js is running`);
    }

    const {
      dw = 1920,
      dh = 1080,
      el = typeof options === "string" ? options : "body",
      resize = true,
      ignore = [],
      transition = "none",
      delay = 0,
      limit = 0.1,
      cssMode = "scale",
      allowScroll = false,
    } = options as AutofitOption;

    state.currRenderDom = el;
    const dom = document.querySelector<HTMLElement>(el);

    if (!dom) {
      console.error(`autofit: '${el}' is not exist`);
      return;
    }

    const style = document.createElement("style");
    const ignoreStyle = document.createElement("style");

    style.lang = "text/css";
    ignoreStyle.lang = "text/css";
    style.id = "autofit-style";
    ignoreStyle.id = "ignoreStyle";

    if (!allowScroll) {
      style.innerHTML = `body {overflow: hidden;}`;
    }

    const bodyEl = document.querySelector("body")!;
    bodyEl.appendChild(style);
    bodyEl.appendChild(ignoreStyle);

    dom.style.height = `${dh}px`;
    dom.style.width = `${dw}px`;
    dom.style.transformOrigin = `0 0`;

    if (!allowScroll) {
      dom.style.overflow = "hidden";
    }

    keepFit(dw, dh, dom, ignore, limit, cssMode);

    state.resizeListener = () => {
      clearTimeout(state.timer!);
      if (delay != 0) {
        state.timer = setTimeout(() => {
          keepFit(dw, dh, dom, ignore, limit, cssMode);
          if (state.isElRectification) {
            elRectification(state.currelRectification, state.currelRectificationIsKeepRatio, state.currelRectificationLevel);
          }
        }, delay) as unknown as number;
      } else {
        keepFit(dw, dh, dom, ignore, limit, cssMode);
        if (state.isElRectification) {
          elRectification(state.currelRectification, state.currelRectificationIsKeepRatio, state.currelRectificationLevel);
        }
      }
    };

    if (resize) {
      window.addEventListener("resize", state.resizeListener);
    }

    this.isAutofitRunning = true;
    state.isAutofitRunning = true;

    setTimeout(() => {
      dom.style.transition = `${transition}s`;
    });
  },

  off(el = "body") {
    try {
      if (state.resizeListener) {
        window.removeEventListener("resize", state.resizeListener);
      }

      const autofitStyle = document.querySelector("#autofit-style");
      if (autofitStyle) {
        autofitStyle.remove();
      }

      const ignoreStyleDOM = document.querySelector("#ignoreStyle");
      if (ignoreStyleDOM) {
        ignoreStyleDOM.remove();
      }

      const targetDom = state.currRenderDom ? (state.currRenderDom as string) : el;
      const temp = document.querySelector<HTMLDivElement>(targetDom);

      if (temp) {
        temp.style.cssText = "";
      }

      if (state.isElRectification) {
        offelRectification();
      }
    } catch (error) {
      console.error(`autofit: Failed to remove normally`, error);
    }

    this.isAutofitRunning = false;
    state.isAutofitRunning = false;
    console.log(`autofit.js is off`);
  },

  elRectification: elRectification,

  get scale() {
    return state.currScale;
  }
};

export default autofit;
