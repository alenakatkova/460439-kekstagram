'use strict';

(function () {

  function renderPicture(picture, index) {
    var template = document.querySelector('#picture-template').content.querySelector('.picture');
    var pictureItem = template.cloneNode(true);
    pictureItem.querySelector('img').src = picture.url;
    pictureItem.querySelector('.picture-comments').textContent = picture.comments.length;
    pictureItem.querySelector('.picture-likes').textContent = picture.likes;
    return pictureItem;
  }

  function successHandler(data) {
    var picturesList = document.querySelector('.pictures');

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
      fragment.appendChild(renderPicture(data[i], i));
    }
    picturesList.appendChild(fragment);

    window.galleryOverlay.addEventListeners();
  }

  // function errorHandler(errorMessage) {
  //   var node = document.createElement('div');
  //   node.className = 'backend-error';
  //   node.textContent = 'Oops! ' + errorMessage + ' Try again later';
  //   document.body.insertAdjacentElement('afterbegin', node);
  // }

  window.backend.load(successHandler, window.util.errorHandler);

})();
