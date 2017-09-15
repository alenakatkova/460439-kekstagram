'use strict';

/**
 * Module contains functions that render, re-render and clear pictures using data received from the server
 */

(function () {

  /**
   * Function copies template and inserts data (received from the parameter) in it.
   * @param {Object} picture - Contains picture URL, amount of likes and list of comments
   * @returns generated picture with stats
   */

  function getPictureItem(picture) {
    var template = document.querySelector('#picture-template').content.querySelector('.picture');
    var pictureItem = template.cloneNode(true);
    pictureItem.querySelector('img').src = picture.url;
    pictureItem.querySelector('.picture-comments').textContent = picture.comments.length;
    pictureItem.querySelector('.picture-likes').textContent = picture.likes;
    return pictureItem;
  }

  var picturesList = document.querySelector('.pictures');

  /**
   * Function renders pictures using data from array and inserts them into container.
   * It also adds event listeners to the rendered pictures. These listeners are used to open
   * each picture in gallery overlay by clicking on it / pressing ENTER when focused on it.
   * @param {Array} arr - Contains objects with pictures' data: URLs, comments list and amount of likes
   */

  function renderPictures(arr) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      fragment.appendChild(getPictureItem(arr[i]));
    }
    picturesList.appendChild(fragment);
    window.galleryOverlay.addEventListeners();
  }

  /**
   * Function deletes rendered pictures from the container.
   * To be used when applying new filter.
   */

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

  /**
   * Function deletes rendered earlier pictures and re-renders them when user clicks applies filter.
   * Uses debounce function to prevent from blinking when user clicks on filters to fast.
   */

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

  /**
   * Function renders pictures when data from the server is susccessfully received.
   * When pictures are rendered, function shows list of filters and adds event listeners to them.
   * @param {Array} data - Data from the server. Contains objects with pictures' URLS,
   * list of comments and amount of likes.
   */

  function successHandler(data) {
    pictures = data;
    renderPictures(pictures);
    filtersController.classList.remove('hidden');
    filtersController.addEventListener('click', onFiltersClick);
  }

  /**
   * getting data from server
   */

  window.backend.load(successHandler, window.util.errorHandler);
})();
