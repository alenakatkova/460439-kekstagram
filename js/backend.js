'use strict';

(function () {
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

    xhr.timeout = 10000;

    return xhr;
  }

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
})();
