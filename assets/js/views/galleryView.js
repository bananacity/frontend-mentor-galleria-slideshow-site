import * as DOM from '../dom.js';
import * as State from '../state.js';
import { BASE_IMG_PATH } from '../config.js';
import { compareArrays, getLayoutFromPageSize } from '../utils/helpers.js';
import { slideShowController } from '../controllers/slideshowController.js';

function animateGalleryMasonry() {
  const items = Array.from(document.querySelectorAll('.gallery-item'));

  // Shuffle the items array
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  items.forEach((item, index) => {
    // groups of 5
    const group = Math.ceil(index / 5);
    const delay = Math.max(group * 250, 250);

    setTimeout(() => item.classList.remove('hidden'), delay);
  });
}

export function renderGalleryMasonry(layout = State.getCurrentLayout()) {
  const artworks = State.getArtworks();
  const colLayouts = {
    desktop: [4, 4, 3, 4],
    tablet: [7, 8],
    mobile: [15],
  };

  State.sortArtworks(layout);

  const colLayout = colLayouts[layout];
  const filledCols = [];
  const colElements = [];

  DOM.galleryMasonry.innerHTML = ``;

  let artworkIndex = 0;
  while (!compareArrays(filledCols, colLayout)) {
    for (let colIndex = 0; colIndex < colLayout.length; colIndex++) {
      if (filledCols[colIndex] !== colLayout[colIndex]) {
        if (!filledCols[colIndex]) {
          // first run for this column so create the column element
          const galleryColEl = document.createElement('div');
          galleryColEl.className = 'gallery-col';
          DOM.galleryMasonry.appendChild(galleryColEl);
          colElements.push(galleryColEl);
        }

        // create gallery item
        const artwork = artworks[artworkIndex];

        const galleryItemEl = document.createElement('a');
        galleryItemEl.setAttribute('data-artwork-id', artwork.id);
        galleryItemEl.setAttribute('tabindex', artworkIndex + 1);
        galleryItemEl.href = `${artwork.id}`;
        galleryItemEl.className = 'gallery-item hidden';
        galleryItemEl.innerHTML = `<figure class="gallery-item-figure">
              <img
                src="${BASE_IMG_PATH + artwork.id}/thumbnail.jpg"
                alt="Artwork of ${artwork.name}, by ${artwork.artist.name}."
                class="gallery-item-image"
                draggable="false"
              />

              <figcaption class="gallery-item-caption">
                <h2 class="gallery-item-title text-preset-2-mobile">
                  ${artwork.name}
                </h2>
                <p class="gallery-item-artist text-preset-5">
                  ${artwork.artist.name}
                </p>
              </figcaption>
            </figure>`;

        colElements[colIndex].appendChild(galleryItemEl);

        filledCols[colIndex] = (filledCols[colIndex] || 0) + 1;
        artworkIndex++;
      }
    }
  }

  animateGalleryMasonry();
}

function handleGalleryAction(event) {
  const galleryItem = event.target.closest('.gallery-item');

  if (!galleryItem) return;

  event.preventDefault();

  const selectedArtworkId = galleryItem.dataset.artworkId;
  slideShowController.openSlide(State.getArtworkIndexById(selectedArtworkId));
}

DOM.galleryMasonry.addEventListener('click', handleGalleryAction);

function handleGalleryMasonryResize() {
  const newLayout = getLayoutFromPageSize();

  if (newLayout !== State.getCurrentLayout) {
    State.setCurrentLayout(newLayout);
    renderGalleryMasonry();
  }
}

window.addEventListener('resize', handleGalleryMasonryResize);
