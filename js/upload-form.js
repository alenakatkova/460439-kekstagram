'use strict';

/**
 * Module contains functions that describe behaviour of the upload form's elements,
 * including scale controls, effects controls, text inputs.
 */

(function () {
  var uploadForm = document.querySelector('#upload-select-image');
  var fileInput = uploadForm.querySelector('#upload-file');
  var uploadOverlay = uploadForm.querySelector('.upload-overlay');

  /**
   * Function hides file choosing form, openes picture editing form and
   * adds event listener that allows to use ESC to close picture editing form
   */

  function openUploadOverlay() {
    fileInput.classList.add('hidden');
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onOpenResizePressEsc);
  }

  /**
   * Function closes upload overlay, resets inputs values to default,
   * removes event listeners added when upload overlay was open,
   * opens back file selecting form.
   */

  function closeUploadOverlay() {
    uploadOverlay.classList.add('hidden');
    reset();
    document.removeEventListener('keydown', onOpenResizePressEsc);
    fileInput.click();
  }

  var submit = uploadOverlay.querySelector('#upload-submit');
  var uploadFormCancel = uploadOverlay.querySelector('#upload-cancel');

  uploadFormCancel.addEventListener('click', closeUploadOverlay);
  submit.addEventListener('click', validateForm);
  fileInput.addEventListener('change', openUploadOverlay);

  var commentInput = uploadForm.querySelector('.upload-form-description');

  /**
   * Function allows to use ESC to close upload overlay.
   * Exception: when comment input is focused, ESC doesn't work.
   */

  function onOpenResizePressEsc(evt) {
    if (evt.target !== commentInput) {
      window.util.isEscEvent(evt, closeUploadOverlay);
    }
  }

  var scaleControls = document.querySelector('.upload-resize-controls');

  /**
   * Function sets scale style to the picture.
   * Calculations are made in the module initialize-scale.js.
   * @param {Number} scaleValue - Value is set by the user.
   */

  function adjustScale(scaleValue) {
    effectImagePreview.style.transform = 'scale(' + scaleValue / 100 + ')';
  }

  window.initializeScale(scaleControls, adjustScale);


  var effectControls = uploadForm.querySelector('.upload-effect-controls');
  var effectImagePreview = uploadForm.querySelector('.effect-image-preview');
  var previewClasses = effectImagePreview.classList;

  /**
   * Function sets effect's class to the picture preview removing previous effect's class
   * @param {String} newEffectClass - Is defined in the module initialize-filters.js.
   */

  function applyEffect(newEffectClass) {
    previewClasses.remove(previewClasses[1]);
    previewClasses.add(newEffectClass);
    setDefaultEffectValues();
  }

  window.initializeFilters(effectControls, applyEffect);

  var effectLevel = effectControls.querySelector('.upload-effect-level');
  var effectPin = effectControls.querySelector('.upload-effect-level-pin');
  var effectVal = effectControls.querySelector('.upload-effect-level-val');
  var minX = 0;
  var maxX = 455;
  var defaultX = 0.2 * maxX;

  /**
   * Object with functions for checking which effect is chosen.
   */

  var effects = {
    isNothingChosen: function () {
      return (previewClasses.length === 1 || previewClasses.contains('effect-none'));
    },
    isChromeChosen: function () {
      return (previewClasses.contains('effect-chrome'));
    },
    isSepiaChosen: function () {
      return (previewClasses.contains('effect-sepia'));
    },
    isMarvinChosen: function () {
      return (previewClasses.contains('effect-marvin'));
    },
    isPhobosChosen: function () {
      return (previewClasses.contains('effect-phobos'));
    },
    isHeatChosen: function () {
      return (previewClasses.contains('effect-heat'));
    }
  };

  /**
   * Functions sets effect's values to default,
   * hides effect's intensity input if no effect is chosen.
   */

  function setDefaultEffectValues() {
    if (effects.isNothingChosen()) {
      effectLevel.classList.add('hidden');
    } else {
      effectLevel.classList.remove('hidden');
    }
    effectPin.style.left = '20%';
    effectVal.style.width = '20%';
    setEffectIntensity(defaultX);
  }

  /**
   * Function changes effect's intensity depending on how user moves intensity pin.
   * @param {Number} currentX - Is used to calculate intensity. It is got when the user moves intensity pin
   */

  function setEffectIntensity(currentX) {
    if (effects.isNothingChosen()) {
      effectImagePreview.style.filter = 'none';
    } else if (effects.isChromeChosen()) {
      effectImagePreview.style.filter = 'grayscale(' + currentX / maxX + ')';
    } else if (effects.isSepiaChosen()) {
      effectImagePreview.style.filter = 'sepia(' + currentX / maxX + ')';
    } else if (effects.isMarvinChosen()) {
      effectImagePreview.style.filter = 'invert(' + currentX / maxX * 100 + '%)';
    } else if (effects.isPhobosChosen()) {
      effectImagePreview.style.filter = 'blur(' + currentX / maxX * 3 + 'px)';
    } else if (effects.isHeatChosen()) {
      effectImagePreview.style.filter = 'brightness(' + currentX / maxX * 3 + ')';
    }
  }

  /**
   * Function proccess mousedown, mosemove and mouseup events on intensity pin.
   * Calculates offset of the pin and uses this number to calculate intensity of the effect.
   */

  function onEffectPinMousedown(evt) {
    evt.preventDefault();

    var startX = evt.clientX;

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var shiftX = startX - moveEvt.clientX;
      startX = moveEvt.clientX;
      var offset = effectPin.offsetLeft - shiftX;

      if (offset < minX) {
        effectPin.style.left = minX + 'px';
        effectVal.style.width = minX + 'px';
      } else if (offset > maxX) {
        effectPin.style.left = maxX + 'px';
        effectVal.style.width = maxX + 'px';
      } else {
        effectPin.style.left = offset + 'px';
        effectVal.style.width = offset + 'px';
      }
      setEffectIntensity(offset);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  effectPin.addEventListener('mousedown', onEffectPinMousedown);

  var hashtagInput = uploadForm.querySelector('.upload-form-hashtags');

  /**
   * Function sets rules and error messages for hashtags input, and validates it.
   * If input is empty / valid, error message is hidden.
   */

  function validateHashtagInput() {
    if (hashtagInput.value.length > 0) {
      var hashtags = hashtagInput.value.split(' ');

      var maxHashtagLength = 20;
      var maxAmountOfHashtags = 5;

      /**
       * Functions check validity of the hashtag input.
       * @return true if invalid
       */

      var hashtagInvalidities = {
        isHashMissing: function () {
          for (var i = 0; i < hashtags.length; i++) {
            if (hashtags[i][0] !== '#') {
              return true;
            }
          }
          return false;
        },

        isSpaceMissing: function () {
          for (var i = 0; i < hashtags.length; i++) {
            if (hashtags[i].indexOf('#', 1) !== -1) {
              return true;
            }
          }
          return false;
        },

        isWordMissing: function () {
          for (var i = 0; i < hashtags.length; i++) {
            if (hashtags[i].length === 1 && hashtags[i][0] === '#') {
              return true;
            }
          }
          return false;
        },

        isHashtagRepeated: function () {
          return window.util.returnUnique(hashtags) < hashtags.length;
        },

        isHashtagTooLong: function () {
          for (var i = 0; i < hashtags.length; i++) {
            if (hashtags[i].length > maxHashtagLength) {
              return true;
            }
          }
          return false;
        },

        isAmountOfHashtagsTooBig: function () {
          return hashtags.length > maxAmountOfHashtags;
        }
      };

      if (hashtagInvalidities.isAmountOfHashtagsTooBig()) {
        hashtagInput.setCustomValidity('The maximum amount of hashtags is ' + maxAmountOfHashtags);
        showError(hashtagInput);
      } else if (hashtagInvalidities.isHashMissing()) {
        hashtagInput.setCustomValidity('Each hashtag should start with #');
        showError(hashtagInput);
      } else if (hashtagInvalidities.isHashtagTooLong()) {
        hashtagInput.setCustomValidity('Each hashtag shouldn\'t contain more than ' + maxHashtagLength + ' characters');
        showError(hashtagInput);
      } else if (hashtagInvalidities.isHashtagRepeated()) {
        hashtagInput.setCustomValidity('Hashtags shouldn\'t be repeated');
        showError(hashtagInput);
      } else if (hashtagInvalidities.isWordMissing()) {
        hashtagInput.setCustomValidity('Hashtag should contain at least 1 character');
        showError(hashtagInput);
      } else if (hashtagInvalidities.isSpaceMissing()) {
        hashtagInput.setCustomValidity('Hashtags should be splitted by space');
        showError(hashtagInput);
      } else {
        hideError(hashtagInput);
      }
    } else {
      hideError(hashtagInput);
    }
  }

  /**
   * Function sets error messages for comment input, validates it.
   * If input is valid, error message is hidden.
   */

  function validateCommentInput() {
    var minCommentLength = commentInput.getAttribute('minlength');
    var maxCommentLength = commentInput.getAttribute('maxlength');
    var validity = commentInput.validity;

    if (validity.valueMissing) {
      commentInput.setCustomValidity('This field is required');
      showError(commentInput);
    } else if (validity.tooShort) {
      commentInput.setCustomValidity('The comment length should be at least ' + minCommentLength + ' characters');
      showError(commentInput);
    } else if (validity.tooLong) {
      commentInput.setCustomValidity('The comment length should be ' + maxCommentLength + ' caracters or less');
      showError(commentInput);
    } else {
      hideError(commentInput);
    }
  }

  /**
   * Function adds error class to the input.
   * @param {Node} input
   */

  function showError(input) {
    input.classList.add('upload-message-error');
  }

  /**
   * Function removes error class and error message from the input.
   * @param {Node} input
   */

  function hideError(input) {
    input.classList.remove('upload-message-error');
    input.setCustomValidity('');
  }

  /**
   * Function validates two inputs: hashtags and comment.
   * Event listener 'input' is used to validate inputs after first validation that was performed when
   * the user clicked on 'submit' button.
   */

  function validateForm(evt) {
    if (evt.target === submit) {
      validateCommentInput();
      commentInput.addEventListener('input', validateCommentInput);
      validateHashtagInput();
      hashtagInput.addEventListener('input', validateHashtagInput);
    }
  }

  /**
   * Function sets form's values to default, and removes listeners 'input' from inputs
   * to prevent from auto-validating inputs when next picture is being uploaded
   */

  function reset() {
    uploadForm.reset();
    effectImagePreview.style.transform = 'scale(1.00)';
    previewClasses.remove(previewClasses[1]);
    effectImagePreview.style.filter = 'none';
    effectLevel.classList.add('hidden');
    hideError(commentInput);
    hideError(hashtagInput);
    commentInput.removeEventListener('input', validateCommentInput);
    hashtagInput.removeEventListener('input', validateHashtagInput);
  }

  uploadForm.addEventListener('submit', onUploadFormSubmit);

  /**
   * Function launches function save from the module backend.js and passes the following to it:
   * 1) from data, filled in by the user
   * 2) function which closes the form
   * 3) function that processes errors
   * Function save sends data to the server.
   */

  function onUploadFormSubmit(evt) {
    window.backend.save(new FormData(uploadForm), closeUploadOverlay, window.util.errorHandler);
    evt.preventDefault();
  }
})();
