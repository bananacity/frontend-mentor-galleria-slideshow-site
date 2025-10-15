import * as DOM from '../dom.js';

function toggleLightbox() {
  DOM.lightbox.classList.toggle('hidden');
}

function handleLightboxAction(event) {
  const isOverlay =
    event.target.classList.contains('lightbox') ||
    event.target.classList.contains('lightbox-wrapper');

  if (isOverlay) {
    toggleLightbox();
  }
}

export function initLightboxListeners() {
  DOM.lightboxCloseBtn.addEventListener('click', toggleLightbox);
  DOM.ViewImageBtn.addEventListener('click', toggleLightbox);
  DOM.lightbox.addEventListener('click', handleLightboxAction);
}
