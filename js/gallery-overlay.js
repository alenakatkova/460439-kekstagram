'use strict';

(function () {
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');
  var preview = galleryOverlay.querySelector('.gallery-overlay-preview');

  function onOpenGalleryOverlayPressEsc(evt) {
    window.util.isEscEvent(evt, closeGalleryOverlay);
  }

  function onGalleryOverlayClosePressEnter(evt) {
    window.util.isEnterEvent(evt, closeGalleryOverlay);
  }

  /*
   * function showd hidden gallery overlay
     and adds event listeners to allow to use ESC and ENTER
     to close gallery overlay
   */

  function openGalleyOverlay() {
    galleryOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onOpenGalleryOverlayPressEsc);
    galleryOverlayClose.addEventListener('keydown', onGalleryOverlayClosePressEnter);
  }

  function closeGalleryOverlay() {
    galleryOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onOpenGalleryOverlayPressEsc);
    galleryOverlayClose.removeEventListener('keydown', onGalleryOverlayClosePressEnter);
  }

  galleryOverlayClose.addEventListener('click', closeGalleryOverlay);

  /*
   * function gets data (url, amount of comments and likes)
     from the picture that was chosen by user
   * @param is for evt.currentTarget in click and keydown events
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

  /*
   * function add event listeners (click & keydown) to all pictures in the Gallery
   * after clicking / pressing Enter on the picture, gallery overlay is opened
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
