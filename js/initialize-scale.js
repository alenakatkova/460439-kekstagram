'use strict';

(function () {

  window.initializeScale = function (controls, el, max, min, step, callback) {
    controls.addEventListener('click', function (evt) {
      var currentValue = +el.value.slice(0, -1);
      if (evt.target.dataset.scale === "+" && currentValue < max) {
        currentValue += step;
      } else if (evt.target.dataset.scale === "-" && currentValue > min) {
        currentValue -= step;
      }
      el.value = currentValue + '%';

      if (typeof callback === 'function') {
        callback(currentValue);
      }
    });
  };
})();
