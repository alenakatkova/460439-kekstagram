'use strict';

/**
 * @exports function that calculates scale value and sets it to the scale input
 * @param {Node} controls - Form's fieldset responsible for changing scale
 * @param {Function} cb - Callback function fo which we pass calculated scale value
 */

(function () {

  window.initializeScale = function (controls, cb) {
    controls.addEventListener('click', function (evt) {

      var scale = controls.querySelector('input');
      var maxScale = parseInt(scale.max, 10);
      var minScale = parseInt(scale.min, 10);
      var scalingStep = parseInt(scale.step, 10);

      var currentValue = parseInt(scale.value, 10);

      if (evt.target.dataset.scale === '+' && currentValue < maxScale) {
        currentValue += scalingStep;
      } else if (evt.target.dataset.scale === '-' && currentValue > minScale) {
        currentValue -= scalingStep;
      }
      scale.value = currentValue + '%';

      if (typeof cb === 'function') {
        cb(currentValue);
      }
    });
  };
})();
