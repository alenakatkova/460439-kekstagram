'use strict';

(function () {
  // function creates picture and picture' stats using data: URL, amount of comments and likes
  function getPictureItem(picture) {
    var template = document.querySelector('#picture-template').content.querySelector('.picture');
    var pictureItem = template.cloneNode(true);
    pictureItem.querySelector('img').src = picture.url;
    pictureItem.querySelector('.picture-comments').textContent = picture.comments.length;
    pictureItem.querySelector('.picture-likes').textContent = picture.likes;
    return pictureItem;
  }

  var picturesList = document.querySelector('.pictures');

  // function renders pictures using data from array
  function renderPictures(array) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < array.length; i++) {
      fragment.appendChild(getPictureItem(array[i]));
    }
    picturesList.appendChild(fragment);
  }

  // function deletes rendered pictures
  function clearPictures() {
    while (picturesList.firstChild) {
      picturesList.removeChild(picturesList.firstChild);
    }
  }

  var filtersController = document.querySelector('.filters');
  var recommended = filtersController.querySelector('#filter-recommend');
  var popular = filtersController.querySelector('#filter-popular');
  var discussed = filtersController.querySelector('#filter-discussed');
  var random = filtersController.querySelector('#filter-random');
  var pictures = [];

  // function re-renders pictures when user clicks on chosen filter
  function onFiltersClick(evt) {
    if (evt.target.name === 'filter') {
      clearPictures();
    }

    var filteredPictures = pictures.slice();

    switch (evt.target) {
      case popular:
        filteredPictures.sort(function (first, second) {
          return window.util.compareItems(first.likes, second.likes);
        });
        break;
      case discussed:
        filteredPictures.sort(function (first, second) {
          return window.util.compareItems(first.comments.length, second.comments.length);
        });
        break;
      case random:
        filteredPictures.sort(function () {
          return 0.5 - Math.random();
        });
        break;
      case recommended:
        filteredPictures = pictures;
        break;
    }

    window.debounce(function () {
      renderPictures(filteredPictures);
    });
  }

  /*
   * function renders pictures when data from the server is received
   * @param data from the server
   */

  function successHandler(data) {
    pictures = data;
    renderPictures(pictures);

    window.galleryOverlay.addEventListeners();

    filtersController.classList.remove('hidden');
    filtersController.addEventListener('click', onFiltersClick);
  }

  // get data from server
  window.backend.load(successHandler, window.util.errorHandler);
})();
