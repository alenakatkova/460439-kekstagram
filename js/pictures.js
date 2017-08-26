'use strict';

var picturesDataSets = [];
var KEYCODES = {
  ENTER: 13,
  ESC: 27
};
var galleryOverlay = document.querySelector('.gallery-overlay');

function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getPictureUrl(index) {
  return 'photos/' + index + '.jpg';
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

/*
 * function renders pictures using generated data sets
 */

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
  if (evt.keyCode === 27) {
    galleryOverlay.classList.add('hidden');
  }
}

/*
 * function adds specific picture's data set to the opened picture
 */

function openGalleryOverlay(imageURL, pictureNumberInArray) {
  galleryOverlay.classList.remove('hidden');
  var preview = galleryOverlay.querySelector('.gallery-overlay-preview');
  preview.querySelector('.gallery-overlay-image').src = imageURL;
  preview.querySelector('.comments-count').textContent = picturesDataSets[pictureNumberInArray].comments.length;
  preview.querySelector('.likes-count').textContent = picturesDataSets[pictureNumberInArray].likes;
  /*
   * allow to use ESC to close gallery overlay
   */
  document.addEventListener('keydown', onOpenGalleryOverlayPressEsc);
}

function closeGalleryOverlay() {
  galleryOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onOpenGalleryOverlayPressEsc)
}

function addEventListeners() {
  /*
   * opening gallery overlay
   */
  var allPictures = document.querySelectorAll('.picture');
  for (var i = 0; i < allPictures.length; i++) {
    allPictures[i].addEventListener('click', function (evt) {
      evt.preventDefault();
      var currentPicture = evt.currentTarget.querySelector('img');
      openGalleryOverlay(currentPicture.getAttribute('src'),
        currentPicture.getAttribute('data-number-in-array'));
    });
  }
  /*
   * closing gallery overlay
   */
  var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');
  galleryOverlayClose.addEventListener('click', closeGalleryOverlay);

  galleryOverlayClose.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KEYCODES.ENTER) {
      closeGalleryOverlay();
    }
  });
}

document.querySelector('.upload-overlay').classList.add('hidden');

generatePicturesDataSets(25);
renderPictures();
addEventListeners();
