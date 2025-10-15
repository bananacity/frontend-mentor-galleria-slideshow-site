import * as State from '../state.js';
import * as DOM from '../dom.js';

export function compareArrays(a, b) {
  return a.toString() === b.toString();
}

export function getLayoutFromPageSize() {
  const pageWidth = window.innerWidth;

  if (pageWidth >= 800) return 'desktop';
  if (pageWidth > 375) return 'tablet';
  return 'mobile';
}

export function switchToPage(page) {
  if (State.getCurrentPage() === page) return;

  State.setCurrentPage(page);

  if (page === 'gallery') {
    document.title = `galleria: Art showcase`;
    history.pushState({}, '', '/');

    DOM.galleryMasonry.classList.remove('hidden');
    DOM.artworkDetail.classList.add('hidden');
    DOM.slideshowControls.classList.add('hidden');
  } else if (page === 'artwork') {
    DOM.galleryMasonry.classList.add('hidden');
    DOM.artworkDetail.classList.remove('hidden');
    DOM.slideshowControls.classList.remove('hidden');
  }
}
