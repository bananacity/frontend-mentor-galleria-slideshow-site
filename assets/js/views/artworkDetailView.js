import * as DOM from '../dom.js';
import * as State from '../state.js';
import { BASE_IMG_PATH } from '../config.js';
import { switchToPage } from '../utils/helpers.js';
import { slideShowController } from '../controllers/slideshowController.js';
import { updateSlideShowControlsMeta } from './slideshowControlsView.js';

function animateArtworkPage(hide) {
  const elements = [
    DOM.artworkImage,
    DOM.artworkInfo,
    DOM.artworkInfoWrapper,
    DOM.artworkArtistImage,
    DOM.artworkDescription,
    DOM.lightboxArtworkImage,
  ];

  elements.forEach((element) => element.classList.toggle('hidden', hide));
}

export function renderArtworkPage(artworkId) {
  animateArtworkPage(true);

  switchToPage('artwork');

  setTimeout(() => {
    const artwork = State.getArtworkById(artworkId);
    State.setCurrentArtworkId(artworkId);

    slideShowController.updateControls();
    updateArtworkPageMeta(artworkId);

    DOM.artworkImage.src =
      BASE_IMG_PATH + artwork.id + '/' + artwork.images.hero.large;
    DOM.artworkArtistImage.src =
      BASE_IMG_PATH + artwork.id + '/' + artwork.artist.image;
    DOM.lightboxArtworkImage.src =
      BASE_IMG_PATH + artwork.id + '/' + artwork.images.gallery;

    const imageAltText = `${artwork.name} by ${artwork.artist.name}`;
    DOM.artworkImage.alt = imageAltText;
    DOM.lightboxArtworkImage.alt = imageAltText;
    DOM.artworkArtistImage.alt = `Portrait of ${artwork.artist.name}`;

    DOM.artworkTitle.textContent = artwork.name;
    DOM.artworkArtist.textContent = artwork.artist.name;
    DOM.artworkYear.update(artwork.year);
    DOM.artworkDescription.textContent = artwork.description;
    DOM.artworkSourceLink.href = artwork.source;

    updateSlideShowControlsMeta(artworkId);

    setTimeout(() => animateArtworkPage(false), 300);
  }, 300);
}

export function updateArtworkPageMeta(artworkId) {
  const artwork = State.getArtworkById(artworkId);

  document.title = `${artwork.name} by ${artwork.artist.name} - galleria`;
  history.pushState({}, '', artwork.id);
}
