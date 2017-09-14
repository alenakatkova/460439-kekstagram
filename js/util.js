'use strict';

/**
 * @exports to window basic variables and functions that can be used in different modules
 */

(function () {
  var KEYCODES = {
    ENTER: 13,
    ESC: 27
  };

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === KEYCODES.ESC) {
        action();
      }
    },

    isEnterEvent: function (evt, action) {
      if (evt.keyCode === KEYCODES.ENTER) {
        action();
      }
    },

    returnUnique: function (arr) {
      var obj = {};
      for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = '';
      }
      return Object.keys(obj).length;
    },

    errorHandler: function (errorMessage) {
      var node = document.createElement('div');
      node.className = 'backend-error';
      node.textContent = 'Oops! ' + errorMessage + ' Try again later';
      document.body.insertAdjacentElement('afterbegin', node);
    },

    compareItems: function (first, second) {
      return second - first;
    }
  };
})();
