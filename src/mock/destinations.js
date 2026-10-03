import {getRandomInteger} from '../utils.js';

const DESCRIPTION_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const PHOTO_COUNT = 5;

const sentences = DESCRIPTION_TEXT.match(/[^.]+\./g).map((sentence) => sentence.trim());

function getRandomDescription() {
  const start = getRandomInteger(0, sentences.length - 1);

  return sentences.slice(start, start + getRandomInteger(1, 5)).join(' ');
}

function getRandomPictures(city) {
  return Array.from({length: getRandomInteger(1, 5)}, () => ({
    src: `img/photos/${getRandomInteger(1, PHOTO_COUNT)}.jpg`,
    description: `${city} photo`,
  }));
}

function createDestination(id, name) {
  return {
    id,
    name,
    description: getRandomDescription(),
    pictures: getRandomPictures(name),
  };
}

const mockDestinations = [
  createDestination('destination-1', 'Amsterdam'),
  createDestination('destination-2', 'Geneva'),
  createDestination('destination-3', 'Chamonix'),
  createDestination('destination-4', 'Kyoto'),
  {
    id: 'destination-5',
    name: 'Reykjavik',
    description: '',
    pictures: [],
  },
];

export {mockDestinations};
