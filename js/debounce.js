'use strict';

(function() {
  var debounceInterval = 500;
  var lastTimeout;

  window.debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, debounceInterval);
  };
})();
