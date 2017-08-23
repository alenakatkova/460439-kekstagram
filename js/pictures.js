'use strict';
var pictures = [];
var commentsList = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

function generateRandomInteger(min, max) {  // generating random whole number in the range min-max
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function generatePictures(amountOfPictures) {  // generating an array of pictures with URL, random number of likes & random comments
  var picture;
  for (var i = 1; i <= amountOfPictures; i++) {
    picture = {
      url: 'photos/' + i + '.jpg',
      likes: generateRandomInteger(15, 250),
      comments: []
    };
    for (var j = 0; j <= generateRandomInteger(0, 1); j++) {
      picture.comments.push(commentsList[Math.floor(Math.random() * 6)]);
    }
    pictures.push(picture);
  }
}

function renderPictures() {  // rendering pictures from the array
  var template = document.querySelector('#picture-template').content.querySelector('.picture');
  var picturesList = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  for (var k = 0; k < pictures.length; k++) {
    var pictureItem = template.cloneNode(true);
    pictureItem.querySelector('img').src = pictures[k].url;
    pictureItem.querySelector('.picture-comments').textContent = pictures[k].comments.length;
    pictureItem.querySelector('.picture-likes').textContent = pictures[k].likes;
    fragment.appendChild(pictureItem);
  }
  picturesList.appendChild(fragment);
}

document.querySelector('.upload-overlay').classList.add('hidden');

function openPicture(pictureNumber) { // opening picture in the gallery
  var gallery = document.querySelector('.gallery-overlay');
  gallery.classList.remove('hidden');

  var preview = gallery.querySelector('.gallery-overlay-preview');
  preview.querySelector('.gallery-overlay-image').src = pictures[pictureNumber].url;
  preview.querySelector('.comments-count').textContent = pictures[pictureNumber].comments.length;
  preview.querySelector('.likes-count').textContent = pictures[pictureNumber].likes;
}

generatePictures(25);
renderPictures();
openPicture(0);
