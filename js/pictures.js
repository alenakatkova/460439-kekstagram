'use strict';

var picturesDataSets = [];
var KEYCODES = {
  ENTER: 13,
  ESC: 27
};

function generateRandomInteger(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getPictureUrl(index) {
  return 'photos/' + index + '.jpg';
}

function generatePicturesDataSets(amountOfDataSets) {
  var picture;
  var comments = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  for (var i = 1; i <= amountOfDataSets; i++) {
    picture = {
      url: getPictureUrl(i),
      likes: generateRandomInteger(15, 250),
      comments: []
    };
    for (var j = 0; j <= generateRandomInteger(0, 1); j++) {
      picture.comments.push(comments[Math.floor(Math.random() * comments.length)]);
    }
    picturesDataSets.push(picture);
  }
}

function renderPictures() {
  var template = document.querySelector('#picture-template').content.querySelector('.picture');
  var picturesList = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  for (var k = 0; k < picturesDataSets.length; k++) {
    var pictureItem = template.cloneNode(true);
    pictureItem.querySelector('img').src = picturesDataSets[k].url;
    pictureItem.querySelector('img').setAttribute('data-number-in-array', k);
    pictureItem.querySelector('.picture-comments').textContent = picturesDataSets[k].comments.length;
    pictureItem.querySelector('.picture-likes').textContent = picturesDataSets[k].likes;
    fragment.appendChild(pictureItem);
  }
  picturesList.appendChild(fragment);
}

document.querySelector('.upload-overlay').classList.add('hidden');

generatePicturesDataSets(25);
renderPictures();

var allPictures = document.querySelectorAll('.picture');
var galleryOverlay = document.querySelector('.gallery-overlay');
var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');

function onOpenGalleryOverlayEscPress(evt) {
  if (evt.keyCode === KEYCODES.ESC) {
    closeGalleryOverlay();
  }
}

function openGalleryOverlay(imageURL, pictureNumberInArray) {
  galleryOverlay.classList.remove('hidden');
  var preview = galleryOverlay.querySelector('.gallery-overlay-preview');
  preview.querySelector('.gallery-overlay-image').src = imageURL;
  preview.querySelector('.comments-count').textContent = picturesDataSets[pictureNumberInArray].comments.length;
  preview.querySelector('.likes-count').textContent = picturesDataSets[pictureNumberInArray].likes;
  document.addEventListener('keydown', onOpenGalleryOverlayEscPress);
}

function closeGalleryOverlay() {
  galleryOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onOpenGalleryOverlayEscPress);
}

for (var i = 0; i < allPictures.length; i++) {
  allPictures[i].addEventListener('click', function (evt) {
    evt.preventDefault();
    openGalleryOverlay(evt.currentTarget.querySelector('img').getAttribute('src'),
        evt.currentTarget.querySelector('img').getAttribute('data-number-in-array'));
  });

  allPictures[i].addEventListener('keydown', function (evt) {
    evt.preventDefault();
    if (evt.keyCode === KEYCODES.ENTER) {
      openGalleryOverlay(evt.currentTarget.querySelector('img').getAttribute('src'),
          evt.currentTarget.querySelector('img').getAttribute('data-number-in-array'));
    }
  });
}

galleryOverlayClose.addEventListener('click', closeGalleryOverlay);

galleryOverlayClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === KEYCODES.ENTER) {
    closeGalleryOverlay();
  }
});
