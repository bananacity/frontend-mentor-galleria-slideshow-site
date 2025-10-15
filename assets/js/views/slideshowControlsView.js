import * as DOM from '../dom.js';
import * as State from '../state.js';
import { slideShowController } from '../controllers/slideshowController.js';

export function updateSlideShowControlsMeta(artworkId) {
  const artwork = State.getArtworkById(artworkId);

  DOM.slideshowControlsTitle.textContent = artwork.name;
  DOM.slideshowControlsArtist.textContent = artwork.artist.name;
}

export function updateSlideshowControlsProgressValue(value) {
  const filledPercentage = (
    ((value + 1) / State.getArtworks().length) *
    100
  ).toFixed(2);
  DOM.slideshowControlsProgress.style.setProperty(
    '--progress-filled-width',
    `${filledPercentage}%`
  );
}

export function updateSlideshowAutoPlayProgress(value) {
  DOM.slideshowAutoPlayProgress.style.setProperty(
    '--autoplay-progress',
    `${value}%`
  );
}

function handleSlideShowControlsProgressAction(renderPage) {
  const artworkIndex = Number(DOM.slideshowControlsProgress.value);
  const artwork = State.getArtworkByIndex(artworkIndex);

  if (slideShowController.autoPlayEnabled) {
    slideShowController.stopAutoPlay();
  }

  // This causes a small bug where we're listening for input and change seperately so clicking the bar runs both the input and change action rendering the meta twice. but that's not a big deal atm but could look weird if we animate the controller meta updating.
  if (renderPage) {
    slideShowController.openSlide(artworkIndex);
  } else {
    updateSlideShowControlsMeta(artwork.id);
    updateSlideshowControlsProgressValue(artworkIndex);
  }
}

DOM.slideshowControlsProgress.addEventListener('input', () =>
  handleSlideShowControlsProgressAction(false)
);

DOM.slideshowControlsProgress.addEventListener('change', () =>
  handleSlideShowControlsProgressAction(true)
);
