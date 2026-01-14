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

export interface Autofit {
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
  isAutofitRunning: boolean;
  /**
   * @param {string} el - 待处理的元素选择器
   * @param {boolean} isKeepRatio - 是否保持纵横比（可选，默认为true，false时将充满父元素）
   * @param {number|undefined} level - 缩放等级，用于手动调整缩放程度(可选，默认为 1)
   */
  elRectification: (el: string, isKeepRatio?: boolean, level?: number) => void;
  /**
   * 当前缩放比例
   */
  scale: number;
}
