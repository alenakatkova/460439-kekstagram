'use strict';

/**
 * Module contains functions that describe behaviour of the upload form's elements,
 * including scale controls, effects controls, text inputs.
 */

(function () {
  var MIN_X = 0;
  var MAX_X = 455;
  var DEFAULT_X = 0.2 * MAX_X;

  var MAX_HASHTAG_LENGTH = 20;
  var MAX_HASHTAGS_AMOUNT = 5;

  var uploadForm = document.querySelector('#upload-select-image');
  var fileInput = uploadForm.querySelector('#upload-file');
  var uploadOverlay = uploadForm.querySelector('.upload-overlay');

  /**
   * Function hides file choosing form, opens picture editing form and
   * adds event listener that allows to use ESC to close picture editing form
   */

  function onFileInputChange() {
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

  function onUploadFormCancelClick() {
    closeUploadOverlay();
  }

  uploadFormCancel.addEventListener('click', onUploadFormCancelClick);
  submit.addEventListener('click', onSubmitClick);
  fileInput.addEventListener('change', onFileInputChange);

  var description = uploadForm.querySelector('.upload-form-description');

  /**
   * Function allows to use ESC to close upload overlay.
   * Exception: when comment input is focused, ESC doesn't work.
   */

  function onOpenResizePressEsc(evt) {
    if (evt.target !== description) {
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
    setEffectIntensity(DEFAULT_X);
  }

  /**
   * Function changes effect's intensity depending on how user moves intensity pin.
   * @param {Number} currentX - Is used to calculate intensity. It is got when the user moves intensity pin
   */

  function setEffectIntensity(currentX) {
    if (effects.isNothingChosen()) {
      effectImagePreview.style.filter = 'none';
    } else if (effects.isChromeChosen()) {
      effectImagePreview.style.filter = 'grayscale(' + currentX / MAX_X + ')';
    } else if (effects.isSepiaChosen()) {
      effectImagePreview.style.filter = 'sepia(' + currentX / MAX_X + ')';
    } else if (effects.isMarvinChosen()) {
      effectImagePreview.style.filter = 'invert(' + currentX / MAX_X * 100 + '%)';
    } else if (effects.isPhobosChosen()) {
      effectImagePreview.style.filter = 'blur(' + currentX / MAX_X * 3 + 'px)';
    } else if (effects.isHeatChosen()) {
      effectImagePreview.style.filter = 'brightness(' + currentX / MAX_X * 3 + ')';
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

      if (offset < MIN_X) {
        effectPin.style.left = MIN_X + 'px';
        effectVal.style.width = MIN_X + 'px';
      } else if (offset > MAX_X) {
        effectPin.style.left = MAX_X + 'px';
        effectVal.style.width = MAX_X + 'px';
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

  var hashtag = uploadForm.querySelector('.upload-form-hashtags');

  /**
   * Function sets rules and error messages for hashtags input, and validates it.
   * If input is empty / valid, error message is hidden.
   */

  function validateHashtag() {
    if (hashtag.value.length > 0) {
      var hashtags = hashtag.value.split(' ');

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
            if (hashtags[i].length > MAX_HASHTAG_LENGTH + 1) {
              return true;
            }
          }
          return false;
        },

        isAmountOfHashtagsTooBig: function () {
          return hashtags.length > MAX_HASHTAGS_AMOUNT;
        },

        isOnlyWordsUsed: function () {
          return !hashtag.value.match(/^[a-zA-ZА-Яа-яЁё# ]+$/);
        }
      };

      if (hashtagInvalidities.isAmountOfHashtagsTooBig()) {
        hashtag.setCustomValidity('The maximum amount of hashtags is ' + MAX_HASHTAGS_AMOUNT);
        showError(hashtag);
      } else if (hashtagInvalidities.isHashMissing()) {
        hashtag.setCustomValidity('Each hashtag should start with #');
        showError(hashtag);
      } else if (hashtagInvalidities.isHashtagTooLong()) {
        hashtag.setCustomValidity('Each hashtag shouldn\'t contain more than ' + MAX_HASHTAG_LENGTH + ' characters');
        showError(hashtag);
      } else if (hashtagInvalidities.isHashtagRepeated()) {
        hashtag.setCustomValidity('Hashtags shouldn\'t be repeated');
        showError(hashtag);
      } else if (hashtagInvalidities.isWordMissing()) {
        hashtag.setCustomValidity('Hashtag should contain at least 1 character');
        showError(hashtag);
      } else if (hashtagInvalidities.isSpaceMissing()) {
        hashtag.setCustomValidity('Hashtags should be splitted by space');
        showError(hashtag);
      } else if (hashtagInvalidities.isOnlyWordsUsed()) {
        hashtag.setCustomValidity('Hashtags should contain only letters');
        showError(hashtag);
      } else {
        hideError(hashtag);
      }
    } else {
      hideError(hashtag);
    }
  }

  /**
   * Function sets error messages for comment input, validates it. If input is valid, error message is hidden.
   * Dataset attribute & extra short length validation is for browsers that
   * don't support minlength attribute, e.g., Microsoft Edge.
   */

  function validateDescription() {
    var minDescriptionLength = description.getAttribute('minlength') || description.dataset.minlength;
    var maxDescriptionLength = description.getAttribute('maxlength');
    var validity = description.validity;

    if (validity.valueMissing) {
      description.setCustomValidity('This field is required');
      showError(description);
    } else if (validity.tooShort || description.value.length < minDescriptionLength) {
      description.setCustomValidity('The comment length should be at least ' + minDescriptionLength + ' characters');
      showError(description);
    } else if (validity.tooLong) {
      description.setCustomValidity('The comment length should be ' + maxDescriptionLength + ' caracters or less');
      showError(description);
    } else {
      hideError(description);
    }
  }

  /**
   * Functions proccess input events on Description and Hashtags inputs.
   */

  function onDescriptionInput() {
    validateDescription();
  }

  function onHashtagInput() {
    validateHashtag();
  }

  /**
   * Function adds error class to the input passed by parameter.
   * @param {Node} input
   */

  function showError(input) {
    input.classList.add('upload-message-error');
  }

  /**
   * Function removes error class and error message from the input passed by parameter.
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

  function onSubmitClick(evt) {
    if (evt.target === submit) {
      validateDescription();
      description.addEventListener('input', onDescriptionInput);
      validateHashtag();
      hashtag.addEventListener('input', onHashtagInput);
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
    hideError(description);
    hideError(hashtag);
    description.removeEventListener('input', onDescriptionInput);
    hashtag.removeEventListener('input', onHashtagInput);
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
