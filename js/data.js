'use strict';

(function () {
  var picturesDataSets = [];
  var pictureDataSet;

  window.data = {
    getComments: function (index) {
      return picturesDataSets[index].comments.length;
    },

    getLikes: function (index) {
      return picturesDataSets[index].likes;
    },

    getURL: function (index) {
      return picturesDataSets[index].url;
    },

    amountOfDataSets: 26
  };

  // var amountOfDataSets = 26;

  function getPictureUrl(index) {
    return 'photos/' + index + '.jpg';
  }

  var comments = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  for (var i = 1; i <= window.data.amountOfDataSets; i++) {
    pictureDataSet = {
      url: getPictureUrl(i),
      likes: window.util.generateRandomInteger(15, 250),
      comments: []
    };
    for (var j = 0; j <= window.util.generateRandomInteger(0, 1); j++) {
      pictureDataSet.comments.push(comments[window.util.generateRandomInteger(0, comments.length - 1)]);
    }
    picturesDataSets.push(pictureDataSet);
  }
})();
