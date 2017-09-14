'use strict';

(function () {
  window.initializeFilters = function (controls, cb) {
    controls.addEventListener('click', function (evt) {
      if (evt.target.name === 'effect') {
        var effectClass = evt.target.getAttribute('id').slice(7);
        cb(effectClass);
      }
    });
  };
})();
