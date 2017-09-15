'use strict';

/**
 * @exports function that gets class name of the effect from the clicked on radio input
 * @param {Node} controls - Form's fieldset responsible for changing effect
 * @param {Function} cb - Callback function fo which we pass effect's class
 */

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
