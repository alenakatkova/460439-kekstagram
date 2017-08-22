'use strict';
var pictures = [];
var picture = {};
var amountOfPictures = 25;
var commentsList = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var likesMin = 15;
var likesMax = 250;

for (var i = 1; i <= amountOfPictures; i++) {
  picture = {
    url: 'photos/' + i + '.jpg',
    likes: Math.floor(likesMin + Math.random() * (likesMax + 1 - likesMin)),
    comments: []
  };
  for (var j = 0; j <= Math.floor(Math.random() * 2); j++) {
    picture.comments.push(commentsList[Math.floor(Math.random() * 6)]);
  }
  pictures.push(picture);
}

var template = document.querySelector('#picture-template').content.querySelector('.picture');
var picturesList = document.querySelector('.pictures');
var fragment = document.createDocumentFragment();

for (var k = 0; k < pictures.length; k++) {
  var pictureItem = template.cloneNode(true)
  pictureItem.querySelector('img').src = pictures[k].url;
  pictureItem.querySelector('.picture-comments').textContent = pictures[k].comments.length;
  pictureItem.querySelector('.picture-likes').textContent = pictures[k].likes;
  fragment.appendChild(pictureItem);
}
picturesList.appendChild(fragment);

document.querySelector('.upload-overlay').classList.add('hidden');

var gallery = document.querySelector('.gallery-overlay');
gallery.classList.remove('hidden');
var preview = gallery.querySelector('.gallery-overlay-preview');
preview.querySelector('.gallery-overlay-image').src = pictures[0].url;
preview.querySelector('.comments-count').textContent = pictures[0].comments.length;
preview.querySelector('.likes-count').textContent = pictures[0].likes;
