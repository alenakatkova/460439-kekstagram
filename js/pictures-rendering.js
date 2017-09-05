'use strict';

(function () {
  var template = document.querySelector('#picture-template').content.querySelector('.picture');
  var picturesList = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < window.data.amountOfPictures; i++) {
    var pictureItem = template.cloneNode(true);
    pictureItem.querySelector('img').src = window.data.getURL(i);
    pictureItem.querySelector('img').setAttribute('data-number-in-array', i);
    pictureItem.querySelector('.picture-comments').textContent = window.data.getComments(i);
    pictureItem.querySelector('.picture-likes').textContent = window.data.getLikes(i);
    fragment.appendChild(pictureItem);
  }

  picturesList.appendChild(fragment);
})();
