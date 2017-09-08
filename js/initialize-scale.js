'use strict';

(function () {
  var zoomOut = document.querySelector('.upload-resize-controls-button-dec');
  var zoomIn = document.querySelector('.upload-resize-controls-button-inc');
  var scale = document.querySelector('.upload-resize-controls-value');
  var scaleValue = +scale.getAttribute('value').slice(0, -1);
  var maxScale = +scale.getAttribute('max').slice(0, -1);
  var minScale = +scale.getAttribute('min').slice(0, -1);
  var scalingStep = +scale.getAttribute('step').slice(0, -1);

  window.initializeScale = {
    initialize: function (controls, callback) {
      controls.addEventListener('click', function (evt) {
        if (evt.target === zoomIn && scaleValue < maxScale) {
          scaleValue += scalingStep;
        } else if (evt.target === zoomOut && scaleValue > minScale) {
          scaleValue -= scalingStep;
        }
        scale.value = scaleValue + '%';
        if (typeof callback === 'function') {
          callback(scaleValue);
        }
      });
    },

    reset: function () {
      scaleValue = 100;
    }
  };
})();
