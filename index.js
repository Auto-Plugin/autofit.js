"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.elRectification = elRectification;
// type Ignore = Array<{ height: number, width: number, fontSize: number, scale: number, el: HTMLElement, dom: HTMLElement }>;
var currRenderDom = null;
var currelRectification = "";
var currelRectificationLevel = "";
var currelRectificationIsKeepRatio = "";
var resizeListener = null;
var timer = null;
var currScale = 1;
var isElRectification = false;
var autofit = {
    isAutofitRunnig: false,
    init: function (options, isShowInitTip) {
        if (options === void 0) { options = {}; }
        if (isShowInitTip === void 0) { isShowInitTip = true; }
        if (isShowInitTip) {
            console.log("autofit.js is running");
        }
        var _a = options, _b = _a.dw, dw = _b === void 0 ? 1920 : _b, _c = _a.dh, dh = _c === void 0 ? 1080 : _c, _d = _a.el, el = _d === void 0 ? typeof options === "string" ? options : "body" : _d, _e = _a.resize, resize = _e === void 0 ? true : _e, _f = _a.ignore, ignore = _f === void 0 ? [] : _f, _g = _a.transition, transition = _g === void 0 ? "none" : _g, _h = _a.delay, delay = _h === void 0 ? 0 : _h, _j = _a.limit, limit = _j === void 0 ? 0.1 : _j, _k = _a.cssMode, cssMode = _k === void 0 ? "scale" : _k, _l = _a.allowScroll, allowScroll = _l === void 0 ? false : _l;
        currRenderDom = el;
        var dom = document.querySelector(el);
        if (!dom) {
            console.error("autofit: '".concat(el, "' is not exist"));
            return;
        }
        var style = document.createElement("style");
        var ignoreStyle = document.createElement("style");
        style.lang = "text/css";
        ignoreStyle.lang = "text/css";
        style.id = "autofit-style";
        ignoreStyle.id = "ignoreStyle";
        !allowScroll && (style.innerHTML = "body {overflow: hidden;}");
        var bodyEl = document.querySelector("body");
        bodyEl.appendChild(style);
        bodyEl.appendChild(ignoreStyle);
        dom.style.height = "".concat(dh, "px");
        dom.style.width = "".concat(dw, "px");
        dom.style.transformOrigin = "0 0";
        !allowScroll && (dom.style.overflow = "hidden");
        keepFit(dw, dh, dom, ignore, limit, cssMode);
        resizeListener = function () {
            clearTimeout(timer);
            if (delay != 0)
                timer = setTimeout(function () {
                    keepFit(dw, dh, dom, ignore, limit, cssMode);
                    isElRectification &&
                        elRectification(currelRectification, currelRectificationIsKeepRatio, currelRectificationLevel);
                }, delay);
            else {
                keepFit(dw, dh, dom, ignore, limit, cssMode);
                isElRectification &&
                    elRectification(currelRectification, currelRectificationIsKeepRatio, currelRectificationLevel);
            }
        };
        resize && window.addEventListener("resize", resizeListener);
        this.isAutofitRunnig = true;
        setTimeout(function () {
            dom.style.transition = "".concat(transition, "s");
        });
    },
    off: function (el) {
        var _a;
        if (el === void 0) { el = "body"; }
        try {
            window.removeEventListener("resize", resizeListener);
            (_a = document.querySelector("#autofit-style")) === null || _a === void 0 ? void 0 : _a.remove();
            var ignoreStyleDOM = document.querySelector("#ignoreStyle");
            ignoreStyleDOM && ignoreStyleDOM.remove();
            var temp = document.querySelector(currRenderDom ? currRenderDom : el);
            if (temp) {
                // @ts-ignore
                temp.style = "";
            }
            isElRectification && offelRectification();
        }
        catch (error) {
            console.error("autofit: Failed to remove normally", error);
            this.isAutofitRunnig = false;
        }
        this.isAutofitRunnig && console.log("autofit.js is off");
    },
    elRectification: null,
};
function elRectification(el, isKeepRatio, level) {
    var e_1, _a;
    if (isKeepRatio === void 0) { isKeepRatio = true; }
    if (level === void 0) { level = 1; }
    if (!autofit.isAutofitRunnig) {
        console.error("autofit.js：autofit has not been initialized yet");
    }
    offelRectification();
    !el && console.error("autofit.js\uFF1Abad selector: ".concat(el));
    currelRectification = el;
    currelRectificationLevel = level;
    currelRectificationIsKeepRatio = isKeepRatio;
    var currEl = Array.from(document.querySelectorAll(el));
    if (currEl.length == 0) {
        console.error("autofit.js：elRectification found no element");
        return;
    }
    try {
        for (var currEl_1 = __values(currEl), currEl_1_1 = currEl_1.next(); !currEl_1_1.done; currEl_1_1 = currEl_1.next()) {
            var item = currEl_1_1.value;
            var rectification = currScale == 1 ? 1 : Number(currScale) * Number(level);
            if (!isElRectification) {
                item.originalWidth = item.clientWidth;
                item.originalHeight = item.clientHeight;
            }
            if (isKeepRatio) {
                item.style.width = "".concat(item.originalWidth * rectification, "px");
                item.style.height = "".concat(item.originalHeight * rectification, "px");
            }
            else {
                item.style.width = "".concat(100 * rectification, "%");
                item.style.height = "".concat(100 * rectification, "%");
            }
            item.style.transform = "scale(".concat(1 / Number(currScale), ")");
            item.style.transformOrigin = "0 0";
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (currEl_1_1 && !currEl_1_1.done && (_a = currEl_1.return)) _a.call(currEl_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    isElRectification = true;
}
function offelRectification() {
    var e_2, _a;
    if (!currelRectification)
        return;
    isElRectification = false;
    try {
        for (var _b = __values(Array.from(document.querySelectorAll(currelRectification))), _c = _b.next(); !_c.done; _c = _b.next()) {
            var item = _c.value;
            item.style.width = "";
            item.style.height = "";
            item.style.transform = "";
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
function keepFit(dw, dh, dom, ignore, limit, cssMode) {
    var e_3, _a;
    if (cssMode === void 0) { cssMode = "scale"; }
    var clientHeight = document.documentElement.clientHeight;
    var clientWidth = document.documentElement.clientWidth;
    currScale =
        clientWidth / clientHeight < dw / dh ? clientWidth / dw : clientHeight / dh;
    currScale = Math.abs(1 - currScale) > limit ? currScale : 1;
    var height = Math.round(clientHeight / Number(currScale));
    var width = Math.round(clientWidth / Number(currScale));
    dom.style.height = "".concat(height, "px");
    dom.style.width = "".concat(width, "px");
    if (cssMode === "zoom") {
        dom.style.zoom = "".concat(currScale);
    }
    else {
        dom.style.transform = "scale(".concat(currScale, ")");
    }
    var ignoreStyleDOM = document.querySelector("#ignoreStyle");
    ignoreStyleDOM.innerHTML = "";
    try {
        for (var _b = __values(ignore), _c = _b.next(); !_c.done; _c = _b.next()) {
            var temp = _c.value;
            var item = temp;
            var itemEl = item.el || item.dom;
            typeof item == "string" && (itemEl = item);
            if (!itemEl || (typeof itemEl === "object" && !Object.keys(itemEl).length)) {
                console.error("autofit: found invalid or empty selector/object: ".concat(itemEl));
                continue;
            }
            var realScale = item.scale ? item.scale : 1 / Number(currScale);
            var realFontSize = realScale != currScale && item.fontSize;
            var realWidth = realScale != currScale && item.width;
            var realHeight = realScale != currScale && item.height;
            ignoreStyleDOM.innerHTML += "\n".concat(itemEl, " { \n      transform: scale(").concat(realScale, ")!important;\n      transform-origin: 0 0;\n      ").concat(realWidth ? "width: ".concat(realWidth, "!important;") : '', "\n      ").concat(realHeight ? "height: ".concat(realHeight, "!important;") : '', "\n    }");
            if (realFontSize) {
                ignoreStyleDOM.innerHTML += "\n".concat(itemEl, " div ,").concat(itemEl, " span,").concat(itemEl, " a,").concat(itemEl, " * {\n        font-size: ").concat(realFontSize, "px;\n      }");
            }
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
}
// UMD导出需要，UMD导出使用的 export default
// 所以 export 函数|变量|常量 导出的，都需要挂载到 autofit 上，也就是在 export default autofit 上了
autofit.elRectification = elRectification;
exports.default = autofit;
