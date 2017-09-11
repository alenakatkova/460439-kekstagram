'use strict';

(function () {
  var KEYCODES = {
    ENTER: 13,
    ESC: 27
  };

  window.util = {
    generateRandomInteger: function (min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    },

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
    }
  };
})();
