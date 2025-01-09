/**
 * autofit.js v3.2.3
 * (c) 2023-present Larry Zhu
 * Released under the MIT License.
 */

(function(global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.autofit = factory());
})(this, function() {
  "use strict";function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
      t && (r = t);
      var _n = 0, F = function F2() {
      };
      return { s: F, n: function n() {
        return _n >= r.length ? { done: true } : { done: false, value: r[_n++] };
      }, e: function e2(r2) {
        throw r2;
      }, f: F };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o, a = true, u = false;
  return { s: function s() {
    t = t.call(r);
  }, n: function n() {
    var r2 = t.next();
    return a = r2.done, r2;
  }, e: function e2(r2) {
    u = true, o = r2;
  }, f: function f() {
    try {
      a || null == t["return"] || t["return"]();
    } finally {
      if (u) throw o;
    }
  } };
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}

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
    init: function init() {
      var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      var isShowInitTip = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      if (isShowInitTip) {
        console.log("autofit.js is running");
      }
      var _options$dw = options.dw, dw = _options$dw === void 0 ? 1920 : _options$dw, _options$dh = options.dh, dh = _options$dh === void 0 ? 1080 : _options$dh, _options$el = options.el, el = _options$el === void 0 ? typeof options === "string" ? options : "body" : _options$el, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize, _options$ignore = options.ignore, ignore = _options$ignore === void 0 ? [] : _options$ignore, _options$transition = options.transition, transition = _options$transition === void 0 ? "none" : _options$transition, _options$delay = options.delay, delay = _options$delay === void 0 ? 0 : _options$delay, _options$limit = options.limit, limit = _options$limit === void 0 ? 0.1 : _options$limit, _options$cssMode = options.cssMode, cssMode = _options$cssMode === void 0 ? "scale" : _options$cssMode, _options$allowScroll = options.allowScroll, allowScroll = _options$allowScroll === void 0 ? false : _options$allowScroll;
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
      resizeListener = function resizeListener2() {
        clearTimeout(timer);
        if (delay != 0) timer = setTimeout(function() {
          keepFit(dw, dh, dom, ignore, limit, cssMode);
          isElRectification && elRectification(currelRectification, currelRectificationIsKeepRatio, currelRectificationLevel);
        }, delay);
        else {
          keepFit(dw, dh, dom, ignore, limit, cssMode);
          isElRectification && elRectification(currelRectification, currelRectificationIsKeepRatio, currelRectificationLevel);
        }
      };
      resize && window.addEventListener("resize", resizeListener);
      this.isAutofitRunnig = true;
      setTimeout(function() {
        dom.style.transition = "".concat(transition, "s");
      });
    },
    off: function off() {
      var el = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "body";
      try {
        var _document$querySelect;
        window.removeEventListener("resize", resizeListener);
        (_document$querySelect = document.querySelector("#autofit-style")) === null || _document$querySelect === void 0 || _document$querySelect.remove();
        var ignoreStyleDOM = document.querySelector("#ignoreStyle");
        ignoreStyleDOM && ignoreStyleDOM.remove();
        var temp = document.querySelector(currRenderDom ? currRenderDom : el);
        if (temp) {
          temp.style = "";
        }
        isElRectification && offelRectification();
      } catch (error) {
        console.error("autofit: Failed to remove normally", error);
        this.isAutofitRunnig = false;
      }
      this.isAutofitRunnig && console.log("autofit.js is off");
    },
    elRectification: null
  };
  function elRectification(el) {
    var isKeepRatio = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    var level = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
    if (!autofit.isAutofitRunnig) {
      console.error("autofit.js：autofit has not been initialized yet");
    }
    offelRectification();
    !el && console.error("autofit.js：bad selector: ".concat(el));
    currelRectification = el;
    currelRectificationLevel = level;
    currelRectificationIsKeepRatio = isKeepRatio;
    var currEl = Array.from(document.querySelectorAll(el));
    if (currEl.length == 0) {
      console.error("autofit.js：elRectification found no element");
      return;
    }
    for (var _i = 0, _currEl = currEl; _i < _currEl.length; _i++) {
      var item = _currEl[_i];
      var rectification = currScale == 1 ? 1 : Number(currScale) * Number(level);
      if (!isElRectification) {
        item.originalWidth = item.clientWidth;
        item.originalHeight = item.clientHeight;
      }
      if (isKeepRatio) {
        item.style.width = "".concat(item.originalWidth * rectification, "px");
        item.style.height = "".concat(item.originalHeight * rectification, "px");
      } else {
        item.style.width = "".concat(100 * rectification, "%");
        item.style.height = "".concat(100 * rectification, "%");
      }
      item.style.transform = "scale(".concat(1 / Number(currScale), ")");
      item.style.transformOrigin = "0 0";
    }
    isElRectification = true;
  }
  function offelRectification() {
    if (!currelRectification) return;
    isElRectification = false;
    for (var _i2 = 0, _Array$from = Array.from(document.querySelectorAll(currelRectification)); _i2 < _Array$from.length; _i2++) {
      var item = _Array$from[_i2];
      item.style.width = "";
      item.style.height = "";
      item.style.transform = "";
    }
  }
  function keepFit(dw, dh, dom, ignore, limit) {
    var cssMode = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : "scale";
    var clientHeight = document.documentElement.clientHeight;
    var clientWidth = document.documentElement.clientWidth;
    currScale = clientWidth / clientHeight < dw / dh ? clientWidth / dw : clientHeight / dh;
    currScale = Math.abs(1 - currScale) > limit ? currScale : 1;
    var height = Math.round(clientHeight / Number(currScale));
    var width = Math.round(clientWidth / Number(currScale));
    dom.style.height = "".concat(height, "px");
    dom.style.width = "".concat(width, "px");
    if (cssMode === "zoom") {
      dom.style.zoom = "".concat(currScale);
    } else {
      dom.style.transform = "scale(".concat(currScale, ")");
    }
    var ignoreStyleDOM = document.querySelector("#ignoreStyle");
    ignoreStyleDOM.innerHTML = "";
    var _iterator = _createForOfIteratorHelper(ignore), _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var temp = _step.value;
        var item = temp;
        var itemEl = item.el || item.dom;
        typeof item == "string" && (itemEl = item);
        if (!itemEl || _typeof(itemEl) === "object" && !Object.keys(itemEl).length) {
          console.error("autofit: found invalid or empty selector/object: ".concat(itemEl));
          continue;
        }
        var realScale = item.scale ? item.scale : 1 / Number(currScale);
        var realFontSize = realScale != currScale && item.fontSize;
        var realWidth = realScale != currScale && item.width;
        var realHeight = realScale != currScale && item.height;
        ignoreStyleDOM.innerHTML += "\n".concat(itemEl, " { \n      transform: scale(").concat(realScale, ")!important;\n      transform-origin: 0 0;\n      ").concat(realWidth ? "width: ".concat(realWidth, "!important;") : "", "\n      ").concat(realHeight ? "height: ".concat(realHeight, "!important;") : "", "\n    }");
        if (realFontSize) {
          ignoreStyleDOM.innerHTML += "\n".concat(itemEl, " div ,").concat(itemEl, " span,").concat(itemEl, " a,").concat(itemEl, " * {\n        font-size: ").concat(realFontSize, "px;\n      }");
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  autofit.elRectification = elRectification;
  return autofit;
});
