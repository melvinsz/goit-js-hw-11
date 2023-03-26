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
ref.loadMore.style.display = 'none';

ref.searchBtn.addEventListener('click', onSearchClick);

function onSearchClick(e) {
  e.preventDefault();
  const name = ref.searchInput.value.trim();
  if (name !== '') {
    fetchPictures(name)
      .then(cards => {
        if (cards.length > 0) {
          renderMarkup(cards);
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

async function fetchPictures(name) {
  return await axios
    .get(
      `${BASE_URL}?key=34746416-8804c3e057cfbf229fa5fe7fd&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&`
    )
    .then(response => response.data.hits);
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
  <img src="${largeImageURL}" alt="${tags}" loading="lazy"/>
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
  ref.gallery.innerHTML = markup;
}

function updateMarkup() {
  ref.gallery.innerHTML = '';
  ref.loadMore.style.display = 'none';
}
