import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '20826556-19d7dce6dc96816ed1b7dccf7';

export const findImage = (query, page) => {
  const params = new URLSearchParams({
    q: query,
    page: page,
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    per_page: 12,
  });

  return axios.get(`?${params}`).then(response => response.data);
};
