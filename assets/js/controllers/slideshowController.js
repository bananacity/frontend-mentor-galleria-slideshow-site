import * as DOM from '../dom.js';
import * as State from '../state.js';
import {
  updateSlideshowControlsProgressValue,
  updateSlideshowAutoPlayProgress,
} from '../views/slideshowControlsView.js';
import { renderArtworkPage } from '../views/artworkDetailView.js';
import { switchToPage } from '../utils/helpers.js';

class SlideShowController {
  currentIndex = 0;
  autoPlayEnabled = false;
  autoPlayInterval = 10_000;
  autoPlayIntervalId;
  autoPlayProgress = 0; // 0 - 100
  autoPlayProgressInterval = 2_000;
  autoPlayProgressIntervalId;

  updateControls() {
    const isFirstSlide = this.currentIndex === 0;
    const isLastSlide = this.currentIndex === State.getArtworks().length - 1;

    DOM.slideshowControlsNextBtn.disabled =
      !this.autoPlayEnabled && isLastSlide;
    DOM.slideshowControlsPrevBtn.disabled =
      !this.autoPlayEnabled && isFirstSlide;

    updateSlideshowControlsProgressValue(this.currentIndex);

    DOM.slideshowControlsToggle.textContent = this.autoPlayEnabled
      ? 'Stop Slideshow'
      : 'Start Slideshow';
  }

  openSlide(artworkIndex) {
    this.currentIndex = artworkIndex;

    const artwork = State.getArtworkByIndex(this.currentIndex);
    renderArtworkPage(artwork.id);
  }

  nextSlide() {
    let artworkIndex;
    const lastIndex = State.getArtworks().length - 1;

    if (this.currentIndex === lastIndex && this.autoPlayEnabled) {
      artworkIndex = 0;
    } else {
      artworkIndex = Math.min(this.currentIndex + 1, lastIndex);
    }

    this.openSlide(artworkIndex);
  }

  prevSlide() {
    let artworkIndex;
    const firstIndex = 0;
    const lastIndex = State.getArtworks().length - 1;

    if (this.currentIndex === firstIndex && this.autoPlayEnabled) {
      artworkIndex = lastIndex;
    } else {
      artworkIndex = Math.max(this.currentIndex - 1, 0);
    }

    this.openSlide(artworkIndex);
  }

  toggleAutoPlay() {
    if (this.autoPlayEnabled) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  startAutoPlay() {
    this.autoPlayEnabled = true;
    this.updateControls();

    if (State.getCurrentPage() !== 'artwork') switchToPage('artwork');

    this.autoPlayProgressIntervalId = setInterval(() => {
      const progressIncrementAmount =
        100 / (this.autoPlayInterval / this.autoPlayProgressInterval - 1);

      if (this.autoPlayProgress + progressIncrementAmount > 100) {
        this.autoPlayProgress = 0;
      } else {
        this.autoPlayProgress += progressIncrementAmount;
      }

      updateSlideshowAutoPlayProgress(this.autoPlayProgress);
    }, this.autoPlayProgressInterval);

    this.autoPlayIntervalId = setInterval(() => {
      this.autoPlayProgress = 0;
      updateSlideshowAutoPlayProgress(this.autoPlayProgress);

      this.nextSlide();
    }, this.autoPlayInterval);
  }

  stopAutoPlay() {
    this.autoPlayEnabled = false;
    this.updateControls();

    clearInterval(this.autoPlayIntervalId);
    clearInterval(this.autoPlayProgressIntervalId);
    this.autoPlayProgress = 0;
    updateSlideshowAutoPlayProgress(this.autoPlayProgress);
  }
}

export const slideShowController = new SlideShowController();

DOM.slideshowControlsToggle.addEventListener('click', () =>
  slideShowController.toggleAutoPlay()
);

DOM.slideshowControlsPrevBtn.addEventListener('click', () =>
  slideShowController.prevSlide()
);

DOM.slideshowControlsNextBtn.addEventListener('click', () =>
  slideShowController.nextSlide()
);
