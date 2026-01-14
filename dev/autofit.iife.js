
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function() {

"use strict";

//#region src/state.ts
const state = {
	currRenderDom: null,
	currelRectification: "",
	currelRectificationLevel: "",
	currelRectificationIsKeepRatio: "",
	resizeListener: null,
	timer: null,
	currScale: 1,
	isElRectification: false,
	isAutofitRunning: false
};

//#endregion
//#region src/rectification.ts
function elRectification(el, isKeepRatio = true, level = 1) {
	if (!state.isAutofitRunning) {
		console.error("autofit.js：(elRectification): autofit has not been initialized yet");
		return;
	}
	offelRectification();
	!el && console.error(`autofit.js：elRectification bad selector: ${el}`);
	state.currelRectification = el;
	state.currelRectificationLevel = level;
	state.currelRectificationIsKeepRatio = isKeepRatio;
	const currEl = Array.from(document.querySelectorAll(el));
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
function offelRectification() {
	if (!state.currelRectification) return;
	state.isElRectification = false;
	for (const item of Array.from(document.querySelectorAll(state.currelRectification))) {
		item.style.width = ``;
		item.style.height = ``;
		item.style.transform = ``;
	}
}

//#endregion
//#region src/strategy.ts
function keepFit(dw, dh, dom, ignore, limit, cssMode = "scale") {
	const clientHeight = document.documentElement.clientHeight;
	const clientWidth = document.documentElement.clientWidth;
	state.currScale = clientWidth / clientHeight < dw / dh ? clientWidth / dw : clientHeight / dh;
	state.currScale = Math.abs(1 - state.currScale) > limit ? state.currScale : 1;
	const height = Math.round(clientHeight / Number(state.currScale));
	const width = Math.round(clientWidth / Number(state.currScale));
	dom.style.height = `${height}px`;
	dom.style.width = `${width}px`;
	if (cssMode === "zoom") dom.style.zoom = `${state.currScale}`;
else dom.style.transform = `translateZ(0) scale(${state.currScale})`;
	const ignoreStyleDOM = document.querySelector("#ignoreStyle");
	ignoreStyleDOM.innerHTML = "";
	for (const temp of ignore) {
		const item = temp;
		let itemEl = item.el || item.dom;
		typeof item == "string" && (itemEl = item);
		if (!itemEl || typeof itemEl === "object" && !Object.keys(itemEl).length) {
			console.error(`autofit: found invalid or empty selector/object: ${itemEl}`);
			continue;
		}
		const realScale = item.scale ? item.scale : 1 / Number(state.currScale);
		const realFontSize = realScale != state.currScale && item.fontSize;
		const realWidth = realScale != state.currScale && item.width;
		const realHeight = realScale != state.currScale && item.height;
		ignoreStyleDOM.innerHTML += `\n${itemEl} { 
      transform: scale(${realScale})!important;
      transform-origin: 0 0;
      ${realWidth ? `width: ${realWidth}!important;` : ""}
      ${realHeight ? `height: ${realHeight}!important;` : ""}
    }`;
		if (realFontSize) ignoreStyleDOM.innerHTML += `\n${itemEl} div ,${itemEl} span,${itemEl} a,${itemEl} * {
        font-size: ${realFontSize}px;
      }`;
	}
}

//#endregion
//#region src/index.ts
const autofit = {
	isAutofitRunning: false,
	init(options = {}, isShowInitTip = true) {
		if (isShowInitTip) console.log(`autofit.js is running`);
		const { dw = 1920, dh = 1080, el = typeof options === "string" ? options : "body", resize = true, ignore = [], transition = "none", delay = 0, limit = .1, cssMode = "scale", allowScroll = false } = options;
		state.currRenderDom = el;
		const dom = document.querySelector(el);
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
		if (!allowScroll) style.innerHTML = `body {overflow: hidden;}`;
		const bodyEl = document.querySelector("body");
		bodyEl.appendChild(style);
		bodyEl.appendChild(ignoreStyle);
		dom.style.height = `${dh}px`;
		dom.style.width = `${dw}px`;
		dom.style.transformOrigin = `0 0`;
		if (!allowScroll) dom.style.overflow = "hidden";
		keepFit(dw, dh, dom, ignore, limit, cssMode);
		state.resizeListener = () => {
			clearTimeout(state.timer);
			if (delay != 0) state.timer = setTimeout(() => {
				keepFit(dw, dh, dom, ignore, limit, cssMode);
				if (state.isElRectification) elRectification(state.currelRectification, state.currelRectificationIsKeepRatio, state.currelRectificationLevel);
			}, delay);
else {
				keepFit(dw, dh, dom, ignore, limit, cssMode);
				if (state.isElRectification) elRectification(state.currelRectification, state.currelRectificationIsKeepRatio, state.currelRectificationLevel);
			}
		};
		if (resize) window.addEventListener("resize", state.resizeListener);
		this.isAutofitRunning = true;
		state.isAutofitRunning = true;
		setTimeout(() => {
			dom.style.transition = `${transition}s`;
		});
	},
	off(el = "body") {
		try {
			if (state.resizeListener) window.removeEventListener("resize", state.resizeListener);
			const autofitStyle = document.querySelector("#autofit-style");
			if (autofitStyle) autofitStyle.remove();
			const ignoreStyleDOM = document.querySelector("#ignoreStyle");
			if (ignoreStyleDOM) ignoreStyleDOM.remove();
			const targetDom = state.currRenderDom ? state.currRenderDom : el;
			const temp = document.querySelector(targetDom);
			if (temp) temp.style.cssText = "";
			if (state.isElRectification) offelRectification();
		} catch (error) {
			console.error(`autofit: Failed to remove normally`, error);
		}
		this.isAutofitRunning = false;
		state.isAutofitRunning = false;
		console.log(`autofit.js is off`);
	},
	elRectification,
	get scale() {
		return state.currScale;
	}
};
var src_default = autofit;

//#endregion
//#region dev/index.ts
console.log("autofit::: ", src_default);
src_default.init({ ignore: ["div[id*=\"el-popper-container\"]"] });
window.addEventListener("resize", () => {
	console.log(src_default.scale);
});

//#endregion
})();