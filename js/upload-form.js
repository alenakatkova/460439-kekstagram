'use strict';

(function () {
  var uploadForm = document.querySelector('#upload-select-image');
  var fileInput = uploadForm.querySelector('#upload-file');

  var uploadOverlay = document.querySelector('.upload-overlay');
  var submit = uploadOverlay.querySelector('#upload-submit');
  var uploadFormCancel = uploadOverlay.querySelector('#upload-cancel');
  var commentInput = uploadForm.querySelector('.upload-form-description');
  var hashtagInput = uploadForm.querySelector('.upload-form-hashtags');
  var effectControls = uploadForm.querySelector('.upload-effect-controls');

  var scaleControls = document.querySelector('.upload-resize-controls');

  var effectImagePreview = uploadForm.querySelector('.effect-image-preview');
  var previewClasses = effectImagePreview.classList;

// function opens upload overlay, adds event listeners

  function openUploadOverlay() {
    // opening upload overlay
    uploadOverlay.classList.remove('hidden');
    fileInput.classList.add('hidden');
    document.addEventListener('keydown', onOpenResizePressEsc);
  }

// adding event listeners
  uploadFormCancel.addEventListener('click', closeUploadOverlay);

  submit.addEventListener('click', validateForm);
// automatic opening of upload overlay when image file is chosen

  fileInput.addEventListener('change', openUploadOverlay);

  /*
   * function closes upload overlay,
       removes event listeners added when upload overlay was open,
       opens back file selecting form
   */

  function closeUploadOverlay() {
    // closing upload overlay
    uploadOverlay.classList.add('hidden');
    // removing keydown event listener
    document.removeEventListener('keydown', onOpenResizePressEsc);
    // opening file selecting form
    fileInput.click();
    // setting all inputs' values to default
    reset();
  }

  /*
   * function allows to use ESC to close upload overlay
   * exception: when comment input is focused, ESC doesn't work
   */

  function onOpenResizePressEsc(evt) {
    if (evt.target !== commentInput) {
      window.util.isEscEvent(evt, closeUploadOverlay);
    }
  }

  function adjustScale(scale) {
    effectImagePreview.style.transform = 'scale(' + scale / 100 + ')';
  }

  window.initializeScale.initialize(scaleControls, adjustScale);

  function applyEffect(newEffectClass) {
    previewClasses.remove(previewClasses[1]);
    previewClasses.add(newEffectClass);
    setDefaultEffectValues();
  }

  window.initializeFilters(effectControls, applyEffect);

  /*
   * function allows to change photo effect by choosing one of the effects listed in input[type="radio"],
       it adds chosen effect's class to the photo preview
       and deletes it when another effect is chosen
   */

  // variables for effects adjustments
  var effectLevel = effectControls.querySelector('.upload-effect-level');
  var effectPin = effectControls.querySelector('.upload-effect-level-pin');
  var effectVal = effectControls.querySelector('.upload-effect-level-val');
  var minX = 0;
  var maxX = 455;
  var defaultX = 0.2 * maxX;

  // object for checking which effect is chosen
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

  // allow to use pin to adjust filter intensity
  effectPin.addEventListener('mousedown', function (evt) {
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
  });

  /* function sets rules and error messages for hashtags input
   * if input is empty, the error is hidden
   */

  function validateHashtagInput() {
    if (hashtagInput.value.length > 0) {
      var hashtags = hashtagInput.value.split(' ');

      var maxHashtagLength = 20;
      var maxAmountOfHashtags = 5;

      /* functions check validity of the hashtag input
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

      // setting error messages of invalidities

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

// function sets error messages for comment input

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

// function makes input's border red when input is invalid

  function showError(input) {
    input.classList.add('upload-message-error');
  }

  function hideError(input) {
    input.classList.remove('upload-message-error');
    input.setCustomValidity('');
  }

  /*
   * function validates two inputs: hashtags and comment
   * event listeners 'inputs' are used to validate inputs after first validation that was performed when
       we clicked on 'submit'
   */

  function validateForm(evt) {
    if (evt.target === submit) {
      validateCommentInput();
      commentInput.addEventListener('input', validateCommentInput);
      validateHashtagInput();
      hashtagInput.addEventListener('input', validateHashtagInput);
    }
  }

// function sets form's values to default

  function reset() {
    uploadForm.reset();
    effectImagePreview.style.transform = 'scale(1.00)';

    window.initializeScale.reset();
    // scaleValue = 100;
    previewClasses.remove(previewClasses[1]);
    effectImagePreview.style.filter = 'none';
    effectLevel.classList.add('hidden');
    hideError(commentInput);
    hideError(hashtagInput);
    // removing listeners prevents from auto-validating inputs when next picture is being uploaded
    commentInput.removeEventListener('input', validateCommentInput);
    hashtagInput.removeEventListener('input', validateHashtagInput);
  }
})();
