export interface IgnoreOption {
  el: string;
  height?: string;
  width?: string;
  scale?: number;
  fontSize?: number;
}
export interface AutofitOption {
  el?: string;
  dw?: number;
  dh?: number;
  resize?: boolean;
  ignore?: (IgnoreOption | string)[];
  transition?: number;
  delay?: number;
  limit?: number;
  cssMode?: "scale" | "zoom";
  allowScroll?: boolean;
}

declare interface autofit {
  /**
   * 参数列表
   * 对象：
   *
   * @param {AutofitOption|String|undefined} options
   * @param {boolean|undefined} isShowInitTip
   * - 传入对象，对象中的属性如下：
   * - el（可选）：渲染的元素，默认是 "body"
   * - dw（可选）：设计稿的宽度，默认是 1920
   * - dh（可选）：设计稿的高度，默认是 1080
   * - resize（可选）：是否监听resize事件，默认是 true
   * - ignore(可选)：忽略缩放的元素（该元素将反向缩放），参数见readme.md
   * - transition（可选）：过渡时间，默认是 0
   * - delay（可选）：延迟，默认是 0
   * - limit（可选）：缩放限制，默认是 0.1
   * - cssMode（可选）：缩放模式，默认是 scale，可选值有 scale 和 zoom, zoom 模式可能对事件偏移有利
   */
  init(options?: AutofitOption | string, isShowInitTip?: boolean): void;
  /**
   * @param {String} id
   * 关闭autofit.js造成的影响
   *
   */
  off(id?: string): void;
  /**
   * 检查autofit.js是否正在运行
   */
  isAutofitRunnig: boolean;
  /**
   * @param {string} el - 待处理的元素选择器
   * @param {boolean} isKeepRatio - 是否保持纵横比（可选，默认为true，false时将充满父元素）
   * @param {number|undefined} level - 缩放等级，用于手动调整缩放程度(可选，默认为 1)
   */
  elRectification: typeof elRectification;
}

// type Ignore = Array<{ height: number, width: number, fontSize: number, scale: number, el: HTMLElement, dom: HTMLElement }>;

let currRenderDom: string | HTMLElement = null!;
let currelRectification = "";
let currelRectificationLevel: string | number = "";
let currelRectificationIsKeepRatio: string | boolean = "";
let resizeListener: EventListenerOrEventListenerObject = null!;
let timer: number = null!;
let currScale: string | number = 1;
let isElRectification = false;
const autofit: autofit = {
  isAutofitRunnig: false,
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
    currRenderDom = el;
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
    !allowScroll && (style.innerHTML = `body {overflow: hidden;}`);
    const bodyEl = document.querySelector("body")!;
    bodyEl.appendChild(style);
    bodyEl.appendChild(ignoreStyle);
    dom.style.height = `${dh}px`;
    dom.style.width = `${dw}px`;
    dom.style.transformOrigin = `0 0`;
    !allowScroll && (dom.style.overflow = "hidden");
    keepFit(dw, dh, dom, ignore, limit, cssMode);
    resizeListener = () => {
      clearTimeout(timer);
      if (delay != 0)
        timer = setTimeout(() => {
          keepFit(dw, dh, dom, ignore, limit, cssMode);
          isElRectification &&
            elRectification(currelRectification, currelRectificationIsKeepRatio, currelRectificationLevel);
        }, delay) as unknown as number;
      else {
        keepFit(dw, dh, dom, ignore, limit, cssMode);
        isElRectification &&
          elRectification(currelRectification, currelRectificationIsKeepRatio, currelRectificationLevel);
      }
    };
    resize && window.addEventListener("resize", resizeListener);
    this.isAutofitRunnig = true;
    setTimeout(() => {
      dom.style.transition = `${transition}s`;
    });
  },
  off(el = "body") {
    try {
      window.removeEventListener("resize", resizeListener);
      document.querySelector("#autofit-style")?.remove();
      const ignoreStyleDOM = document.querySelector("#ignoreStyle");
      ignoreStyleDOM && ignoreStyleDOM.remove();
      const temp = document.querySelector<HTMLDivElement>(currRenderDom ? currRenderDom as string : el);
      if (temp) {
        // @ts-ignore
        temp.style = "";
      }
      isElRectification && offelRectification();
    } catch (error) {
      console.error(`autofit: Failed to remove normally`, error);
      this.isAutofitRunnig = false;
    }
    this.isAutofitRunnig && console.log(`autofit.js is off`);
  },
  elRectification: null!,
};

function elRectification(el: string, isKeepRatio: string | boolean = true, level: string | number = 1) {
  if (!autofit.isAutofitRunnig) {
    console.error("autofit.js：autofit has not been initialized yet");
  }
  offelRectification();
  !el && console.error(`autofit.js：bad selector: ${el}`);
  currelRectification = el;
  currelRectificationLevel = level;
  currelRectificationIsKeepRatio = isKeepRatio;
  const currEl = Array.from(document.querySelectorAll<HTMLElement & { originalWidth: number, originalHeight: number }>(el));
  if (currEl.length == 0) {
    console.error("autofit.js：elRectification found no element");
    return;
  }
  for (const item of currEl) {
    const rectification = currScale == 1 ? 1 : Number(currScale) * Number(level);
    if (!isElRectification) {
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
    item.style.transform = `scale(${1 / Number(currScale)})`;
    item.style.transformOrigin = `0 0`;
  }
  isElRectification = true;
}

function offelRectification() {
  if (!currelRectification) return;
  isElRectification = false;
  for (const item of Array.from(document.querySelectorAll<HTMLElement>(currelRectification))) {
    item.style.width = ``;
    item.style.height = ``;
    item.style.transform = ``;
  }
}
function keepFit(
  dw: number,
  dh: number,
  dom: HTMLElement,
  ignore: AutofitOption['ignore'],
  limit: number,
  cssMode: AutofitOption['cssMode'] = "scale"
) {
  const clientHeight = document.documentElement.clientHeight;
  const clientWidth = document.documentElement.clientWidth;
  currScale =
    clientWidth / clientHeight < dw / dh ? clientWidth / dw : clientHeight / dh;
  currScale = Math.abs(1 - currScale) > limit ? currScale : 1;
  const height = Math.round(clientHeight / Number(currScale));
  const width = Math.round(clientWidth / Number(currScale));
  dom.style.height = `${height}px`;
  dom.style.width = `${width}px`;
  if (cssMode === "zoom") {
    dom.style.zoom = `${currScale}`;
  } else {
    dom.style.transform = `scale(${currScale})`;
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
    const realScale = item.scale ? item.scale : 1 / Number(currScale);
    const realFontSize = realScale != currScale && item.fontSize;
    const realWidth = realScale != currScale && item.width;
    const realHeight = realScale != currScale && item.height;
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

// UMD导出需要，UMD导出使用的 export default
// 所以 export 函数|变量|常量 导出的，都需要挂载到 autofit 上，也就是在 export default autofit 上了
autofit.elRectification = elRectification;
export { elRectification };
export default autofit;
