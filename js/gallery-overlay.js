'use strict';

/**
 * @exports function that adds click and keydown listeners to all pictures in the gallery
 */

(function () {
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');

  function onOpenGalleryOverlayPressEsc(evt) {
    window.util.isEscEvent(evt, closeGalleryOverlay);
  }

  function onGalleryOverlayClosePressEnter(evt) {
    window.util.isEnterEvent(evt, closeGalleryOverlay);
  }

  /**
   * Function shows hidden gallery overlay, and adds event listeners to allow
   * using ESC and ENTER to close gallery overlay
   */

  function openGalleyOverlay() {
    galleryOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onOpenGalleryOverlayPressEsc);
    galleryOverlayClose.addEventListener('keydown', onGalleryOverlayClosePressEnter);
  }

  /**
   * Function closes gallery overlay, and removes keydown listeners that were
   * added when gallery overlay was opened.
   */

  function closeGalleryOverlay() {
    galleryOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onOpenGalleryOverlayPressEsc);
    galleryOverlayClose.removeEventListener('keydown', onGalleryOverlayClosePressEnter);
  }

  galleryOverlayClose.addEventListener('click', closeGalleryOverlay);

  var preview = galleryOverlay.querySelector('.gallery-overlay-preview');

  /**
   * Function gets data (url, amount of comments and likes) from the picture that was chosen by user.
   * @param {Node} chosenPicture - Is for evt.currentTarget in click and keydown events
   */

  function showPictureInGalleryOverlay(chosenPicture) {
    var pictureStats = chosenPicture.querySelector('.picture-stats');
    var pictureData = {
      url: chosenPicture.querySelector('img').src,
      comments: pictureStats.querySelector('.picture-comments').textContent,
      likes: pictureStats.querySelector('.picture-likes').textContent
    };
    preview.querySelector('.gallery-overlay-image').src = pictureData.url;
    preview.querySelector('.comments-count').textContent = pictureData.comments;
    preview.querySelector('.likes-count').textContent = pictureData.likes;
    openGalleyOverlay();
  }

  /**
   * Function adds event listeners click & keydown to all pictures in the Gallery.
   * After clicking / pressing Enter on the picture, gallery overlay is opened.
   */

  window.galleryOverlay = {
    addEventListeners: function () {
      var allPictures = document.querySelectorAll('.picture');
      for (var i = 0; i < allPictures.length; i++) {
        allPictures[i].addEventListener('click', function (evt) {
          evt.preventDefault();
          showPictureInGalleryOverlay(evt.currentTarget);
        });
        allPictures[i].addEventListener('keydown', function (evt) {
          window.util.isEnterEvent(evt, function () {
            evt.preventDefault();
            showPictureInGalleryOverlay(evt.currentTarget);
          });
        });
      }
    }
  };
})();
