'use strict';

/**
 * @exports debounce function which groups sequential call of the listener in a single call
 */

(function () {
  var debounceInterval = 500;
  var lastTimeout;

  window.debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, debounceInterval);
  };
})();
