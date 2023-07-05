import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '36483572-589c8e3037882858d868a0c70';

export const fetchPictures = async (userSearchQuery, page) => {
  const responce = await axios.get(
    `${BASE_URL}/?key=${API_KEY}&q=${userSearchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=12&page=${page}`
  );
  return responce;
};
