'use strict';

(function () {
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');

  var preview = galleryOverlay.querySelector('.gallery-overlay-preview');

  var allPictures = document.querySelectorAll('.picture');

  function onOpenGalleryOverlayPressEsc(evt) {
    window.util.isEscEvent(evt, closeGalleryOverlay);
  }

  function onGalleryOverlayClosePressEnter(evt) {
    window.util.isEnterEvent(evt, closeGalleryOverlay);
  }

  function openGalleyOverlay(imageURL, pictureNumberInArray) {
    galleryOverlay.classList.remove('hidden');

    // render opened picture
    preview.querySelector('.gallery-overlay-image').src = imageURL;
    preview.querySelector('.comments-count').textContent = window.data.getComments(pictureNumberInArray);
    preview.querySelector('.likes-count').textContent = window.data.getLikes(pictureNumberInArray);

    // allow to use ESC to close gallery overlay
    document.addEventListener('keydown', onOpenGalleryOverlayPressEsc);

    // allow to use ENTER to close gallery overlay when focused on cross button
    galleryOverlayClose.addEventListener('keydown', onGalleryOverlayClosePressEnter);
  }

  function closeGalleryOverlay() {
    galleryOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onOpenGalleryOverlayPressEsc);
    galleryOverlayClose.removeEventListener('keydown', onGalleryOverlayClosePressEnter);
  }

  // add event listeners

  for (var i = 0; i < allPictures.length; i++) {
    allPictures[i].addEventListener('click', function (evt) {
      evt.preventDefault();
      var currentPicture = evt.currentTarget.querySelector('img');
      openGalleyOverlay(currentPicture.getAttribute('src'),
          currentPicture.getAttribute('data-number-in-array'));
    });
  }

  galleryOverlayClose.addEventListener('click', closeGalleryOverlay);
})();
