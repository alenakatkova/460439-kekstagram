'use strict';

var picturesDataSets = [];
var KEYCODES = {
  ENTER: 13,
  ESC: 27
};
var galleryOverlay = document.querySelector('.gallery-overlay');
var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');

function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getPictureUrl(index) {
  return 'photos/' + index + '.jpg';
}

function returnUnique(arr) {
  var obj = {};
  for (var i = 0; i < arr.length; i++) {
    obj[arr[i]] = '';
  }
  return Object.keys(obj).length;
}

/*
 * function generates an array with objects
 * each object is a data set that describes specific picture in the gallery
 * object consists of: picture's URL, random number of likes and an array with random comments from the list
 * @param amountOfDataSets - amount of objects in the array
 */

function generatePicturesDataSets(amountOfDataSets) {
  var pictureDataSet;
  var comments = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  for (var i = 1; i <= amountOfDataSets; i++) {
    pictureDataSet = {
      url: getPictureUrl(i),
      likes: generateRandomInteger(15, 250),
      comments: []
    };
    for (var j = 0; j <= generateRandomInteger(0, 1); j++) {
      pictureDataSet.comments.push(comments[generateRandomInteger(0, comments.length - 1)]);
    }
    picturesDataSets.push(pictureDataSet);
  }
}

// function renders pictures using generated data sets

function renderPictures() {
  var template = document.querySelector('#picture-template').content.querySelector('.picture');
  var picturesList = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < picturesDataSets.length; i++) {
    var pictureItem = template.cloneNode(true);
    pictureItem.querySelector('img').src = picturesDataSets[i].url;
    pictureItem.querySelector('img').setAttribute('data-number-in-array', i);
    pictureItem.querySelector('.picture-comments').textContent = picturesDataSets[i].comments.length;
    pictureItem.querySelector('.picture-likes').textContent = picturesDataSets[i].likes;
    fragment.appendChild(pictureItem);
  }
  picturesList.appendChild(fragment);
}

function onOpenGalleryOverlayPressEsc(evt) {
  if (evt.keyCode === KEYCODES.ESC) {
    galleryOverlay.classList.add('hidden');
  }
}

function onGalleryOverlayClosePressEnter(evt) {
  if (evt.keyCode === KEYCODES.ENTER) {
    galleryOverlay.classList.add('hidden');
  }
}

// function adds specific picture's data set to the opened picture

function openGalleryOverlay(imageURL, pictureNumberInArray) {
  galleryOverlay.classList.remove('hidden');
  var preview = galleryOverlay.querySelector('.gallery-overlay-preview');
  preview.querySelector('.gallery-overlay-image').src = imageURL;
  preview.querySelector('.comments-count').textContent = picturesDataSets[pictureNumberInArray].comments.length;
  preview.querySelector('.likes-count').textContent = picturesDataSets[pictureNumberInArray].likes;
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

function addEventListeners() {
  // opening gallery overlay
  var allPictures = document.querySelectorAll('.picture');
  for (var i = 0; i < allPictures.length; i++) {
    allPictures[i].addEventListener('click', function (evt) {
      evt.preventDefault();
      var currentPicture = evt.currentTarget.querySelector('img');
      openGalleryOverlay(currentPicture.getAttribute('src'),
          currentPicture.getAttribute('data-number-in-array'));
    });
  }
  // closing gallery overlay
  galleryOverlayClose.addEventListener('click', closeGalleryOverlay);
}

document.querySelector('.upload-overlay').classList.add('hidden');

generatePicturesDataSets(25);
renderPictures();
addEventListeners();

var uploadForm = document.querySelector('#upload-select-image');
var fileInput = uploadForm.querySelector('#upload-file');

var uploadOverlay = document.querySelector('.upload-overlay');
var submit = uploadOverlay.querySelector('#upload-submit');
var uploadFormCancel = uploadOverlay.querySelector('.upload-form-cancel');
var commentInput = uploadForm.querySelector('.upload-form-description');
var hashtagInput = uploadForm.querySelector('.upload-form-hashtags');
var effectControl = uploadForm.querySelector('.upload-effect-controls');

var zoomOut = uploadForm.querySelector('.upload-resize-controls-button-dec');
var zoomIn = uploadForm.querySelector('.upload-resize-controls-button-inc');
var scale = uploadForm.querySelector('.upload-resize-controls-value');

var scaleValue = +scale.getAttribute('value').slice(0, -1);
var maxScale = +scale.getAttribute('max').slice(0, -1);
var minScale = +scale.getAttribute('min').slice(0, -1);
var scalingStep = +scale.getAttribute('step').slice(0, -1);

var effectImagePreview = uploadForm.querySelector('.effect-image-preview');
var previewClasses = effectImagePreview.classList;

// function opens upload overlay, adds event listeners

function openUploadOverlay() {
  // opening upload overlay
  uploadOverlay.classList.remove('hidden');
  // adding event listeners
  document.addEventListener('keydown', onOpenResizePressEsc);
  submit.addEventListener('click', validateForm);
  uploadForm.addEventListener('submit', submitAndReset);
  uploadFormCancel.addEventListener('click', closeUploadOverlay);
  effectControl.addEventListener('click', onEffectControlClick);
  zoomOut.addEventListener('click', onZoomOutClick);
  zoomIn.addEventListener('click', onZoomInClick);
}

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
}

/*
 * function allows to use ESC to close upload overlay
 * exception: when comment input is focused, ESC doesn't work
 */

function onOpenResizePressEsc(evt) {
  if (evt.target !== commentInput && evt.keyCode === KEYCODES.ESC) {
    closeUploadOverlay();
  }
}

/*
 * function allows to change photo effect by choosing one of the effects listed in input[type="radio"],
     it adds chosen effect's class to the photo preview
     and deletes it when another effect is chosen
 */

function onEffectControlClick(evt) {
  var target = evt.target;
  if (target.name === 'effect') {
    var effectClass = target.getAttribute('id').slice(7);
    if (previewClasses.length > 1) {
      previewClasses.remove(previewClasses[1]);
    }
    previewClasses.add(effectClass);
  }
}

/*
 * function increases photo's scale when it is under 100%
     by adding 0.25 to the value of transform: scale attribute
 */

function onZoomInClick() {
  if (scaleValue < maxScale) {
    scaleValue += scalingStep;
    scale.value = scaleValue + '%';
    effectImagePreview.style.transform = 'scale(' + scaleValue / 100 + ')';
  }
}

/*
 * function decreases photo's scale when it is more than 25%
     by substracting 0.25 from the value of transform: scale attribute
 */

function onZoomOutClick() {
  if (scaleValue > minScale) {
    scaleValue -= scalingStep;
    scale.value = scaleValue + '%';
    effectImagePreview.style.transform = 'scale(' + scaleValue / 100 + ')';
  }
}

// function sets rules and error messages for hashtags input

function validateHashtagInput() {
  if (hashtagInput.value.length > 0) {
    var hashtags = hashtagInput.value.split(' ');

    var maxHashtagLength = 20;
    var maxAmountOfHashtags = 5;

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
        return returnUnique(hashtags) < hashtags.length;
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
      hashtagInput.setCustomValidity('');
      hideError(hashtagInput);
    }
  }
  return hashtagInput.classList.contains('upload-message-error');
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
    commentInput.setCustomValidity('');
    hideError(commentInput);
  }
  return commentInput.classList.contains('upload-message-error');
}

// function makes input's border red when input is invalid

function showError(input) {
  input.classList.add('upload-message-error');
}

function hideError(input) {
  if (input.classList.contains('upload-message-error')) {
    input.classList.remove('upload-message-error');
  }
}

// function validates two inputs: hashtags and comment

function validateForm(evt) {
  if (evt.target === submit) {
    validateCommentInput();
    validateHashtagInput();
  }
}

// function sets inputs' values to default

function reset() {
  hashtagInput.value = '';
  commentInput.value = '';
  scale.value = '100%';
  previewClasses = 'effect-image-preview';
  fileInput = '';
}

/*
 *function prevents sending the form if fields are filled incorrectly
 * after sending the form inputs' values are set to default
 */


function submitAndReset(evt) {
  if (validateCommentInput() || validateHashtagInput()) {
    evt.preventDefault();
  }
  reset();
}
