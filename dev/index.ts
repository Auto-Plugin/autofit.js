import autofit, { elRectification } from '../src/index';
// import autofit from "autofit.js";
console.log('autofit::: ', autofit);
autofit.init({
  // el: 'body',
  // cssMode: 'zoom',
  // allowScoll: true,
  // limit: 0,
  ignore: ['div[id*="el-popper-container"]']
  // ignore:['.div','.span']
});
// elRectification('.div', true, 1);
window.addEventListener('resize', () => {
  console.log(autofit.scale);
});

