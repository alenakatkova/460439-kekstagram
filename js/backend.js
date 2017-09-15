'use strict';

/**
 * @exports 2 functions to window:
 * 1) load - for processing data received from the server
 * 2) save - for sending data to the server
 * @params {Function} onLoad, onError - Are sent to the function formRequestParameters
 * @param {Array|Object|String|Number} data - Data points out what is sent to the server
 */

(function () {
  var MAX_TIME = 10000;

  window.backend = {
    load: function (onLoad, onError) {
      var request = formRequestParameters(onLoad, onError);
      request.open('GET', 'https://1510.dump.academy/kekstagram/data');
      request.send();
    },

    save: function (data, onLoad, onError) {
      var request = formRequestParameters(onLoad, onError);
      request.open('POST', 'https://1510.dump.academy/kekstagram');
      request.send(data);
    }
  };

  /**
   * Function creates new XMLHttpRequest and adds event listeners to handle success and errors
   * @param {Function} successHandler - Provides action to the case when no error occurred
   * @param {Function} errorHandler - Provides action to the case when error(s) occurred
   * @returns created XMLHttpRequest
   */

  function formRequestParameters(successHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        successHandler(xhr.response);
      } else {
        errorHandler('Unknown status: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler('Connection error');
    });

    xhr.addEventListener('timeout', function () {
      errorHandler('Еhe request processing time has exceeded ' + xhr.timeout / 1000 + ' s.');
    });

    xhr.timeout = MAX_TIME;

    return xhr;
  }
})();
