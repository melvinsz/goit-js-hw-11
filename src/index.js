import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const ref = {
  searchInput: document.querySelector('[name=searchQuery]'),
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};
const BASE_URL = 'https://pixabay.com/api';
ref.loadMore.style.display = 'none';
let page = 1;
let currentQuery = '';

ref.searchForm.addEventListener('submit', onSearchClick);

function onSearchClick(e) {
  e.preventDefault();
  const query = ref.searchInput.value.trim();
  if (query !== '') {
    page = 1;
    currentQuery = query;
    fetchPictures(currentQuery)
      .then(data => {
        const { totalHits, hits } = data;
        if (hits.length > 0) {
          renderMarkup(hits);
          Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
          ref.loadMore.style.display = 'block';
        } else {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          updateMarkup();
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, something went wrong');
      });
  } else {
    updateMarkup();
  }
}

async function fetchPictures(query) {
  const perPage = 40;
  const response = await axios.get(
    `${BASE_URL}?key=34746416-8804c3e057cfbf229fa5fe7fd&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  );
  return ({ totalHits, hits } = response.data);
}

function renderMarkup(cards) {
  const markup = cards
    .map(card => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = card;
      return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
  <div class="info">
    <p class="info-item">
      <b>Likes <span class='api-value'>${likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views <span class='api-value'>${views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments <span class='api-value'>${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads <span class='api-value'>${downloads}</span></b>
    </p>
  </div>
</div>`;
    })
    .join('');
  if (page === 1) {
    ref.gallery.innerHTML = markup;
  } else {
    ref.gallery.insertAdjacentHTML('beforeend', markup);
  }
}

ref.loadMore.addEventListener('click', onMoreClick);

function onMoreClick(e) {
  e.preventDefault();
  page += 1;
  fetchPictures(currentQuery)
    .then(data => {
      const { totalHits, hits } = data;
      renderMarkup(hits);
      const cardsCount = document.querySelectorAll('.photo-card').length;
      if (cardsCount >= totalHits) {
        ref.loadMore.style.display = 'none';
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, something went wrong');
      console.log(error);
      console.log(message);
    });
}

function updateMarkup() {
  ref.gallery.innerHTML = '';
  ref.loadMore.style.display = 'none';
}
