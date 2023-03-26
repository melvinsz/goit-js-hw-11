import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const ref = {
  searchInput: document.querySelector('[name=searchQuery]'),
  searchBtn: document.querySelector('.search-btn'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

const BASE_URL = 'https://pixabay.com/api/';

ref.searchBtn.addEventListener('click', onSearchClick);

function onSearchClick(e) {
  e.preventDefault();
  const name = ref.searchInput.value.trim();
  if (name !== '') {
    fetchPictures(name)
      .then(cards => {
        if (cards.length > 0) {
          renderMarkup(cards);
        } else {
          Notiflix.Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
          ref.gallery.innerHTML = '';
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, something went wrong');
      });
  } else {
    ref.gallery.innerHTML = '';
  }
}

function fetchPictures(name) {
  return axios
    .get(
      `${BASE_URL}?key=34746416-8804c3e057cfbf229fa5fe7fd&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&`
    )
    .then(response => response.data.hits);
}

function renderMarkup(card) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = card;
  const markup = `<div class="photo-card">
  <img src="${largeImageURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${likes}</b>
    </p>
    <p class="info-item">
      <b>${views}</b>
    </p>
    <p class="info-item">
      <b>${comments}</b>
    </p>
    <p class="info-item">
      <b>${downloads}</b>
    </p>
  </div>
</div>`;
  ref.gallery.innerHTML = markup;
}
