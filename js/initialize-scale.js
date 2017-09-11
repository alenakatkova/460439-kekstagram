'use strict';

(function () {

  window.initializeScale = function (controls, callback) {
    controls.addEventListener('click', function (evt) {

      var scale = controls.querySelector('input');
      var maxScale = +scale.getAttribute('max').slice(0, -1);
      var minScale = +scale.getAttribute('min').slice(0, -1);
      var scalingStep = +scale.getAttribute('step').slice(0, -1);

      var currentValue = +scale.value.slice(0, -1);

      if (evt.target.dataset.scale === '+' && currentValue < maxScale) {
        currentValue += scalingStep;
      } else if (evt.target.dataset.scale === '-' && currentValue > minScale) {
        currentValue -= scalingStep;
      }
      scale.value = currentValue + '%';

      if (typeof callback === 'function') {
        callback(currentValue);
      }
    });
  };
})();
