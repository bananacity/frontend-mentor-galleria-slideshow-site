import * as DOM from './dom.js';
import * as State from './state.js';
import { fetchArtworks } from './services/api.js';
import { renderGalleryMasonry } from './views/galleryView.js';
import { slideShowController } from './controllers/slideshowController.js';
import { switchToPage } from './utils/helpers.js';
import { initLightboxListeners } from './views/lightboxView.js';

window.addEventListener('popstate', () => {
  const path = window.location.pathname.slice(1);

  // only works for moving back once, would need to ensure index.html is served for all urls paths to fix it or not set url or use # instead for urls
  if (path === '') {
    switchToPage('gallery');
  } else {
    slideShowController.openSlide(State.getArtworkIndexById(path));
  }
});

function handlePageScrollShadows() {
  const windowScroll = window.scrollY;
  const windowHeight = window.innerHeight;
  const scrollableHeight = document.documentElement.scrollHeight;

  DOM.slideshowAutoPlayProgress.classList.toggle('shadow', windowScroll > 5);
  DOM.slideshowControlsWrapper.classList.toggle(
    'shadow',
    windowScroll + windowHeight >= scrollableHeight
  );
}

document.addEventListener('scroll', handlePageScrollShadows);

function handleHomeLinkAction(event) {
  event.preventDefault();

  slideShowController.stopAutoPlay();

  if (State.getCurrentPage() !== 'gallery') switchToPage('gallery');
}

DOM.homeLink.addEventListener('click', handleHomeLinkAction);

initLightboxListeners();

async function init() {
  const artworks = await fetchArtworks();
  State.setArtworks(artworks);

  if (artworks && artworks.length > 0) {
    renderGalleryMasonry();
  } else {
    DOM.galleryMasonry.innerHTML = `<p class="text-preset-5">Couldn't fetch artworks.</p>`;
  }
}

init();
