const galleryMasonry = document.querySelector('.gallery-masonry');
const artworkDetail = document.querySelector('.artwork-detail');
const artworkImage = document.querySelector('.artwork-image');
const ViewImageBtn = document.querySelector('.view-image-btn');
const artworkTitle = document.querySelector('.artwork-title');
const artworkArtist = document.querySelector('.artwork-artist');
const artworkArtistImage = document.querySelector('.artwork-artist-portrait');
const artworkYear = document.querySelector('.artwork-year');
const artworkDescription = document.querySelector('.artwork-description');
const artworkSourceLink = document.querySelector('.artwork-source-link');
const slideshowControls = document.querySelector('.slideshow-controls');
const slideshowControlsProgress = document.querySelector(
  '.slideshow-controls-progress'
);
const slideshowControlsTitle = document.querySelector(
  '.slideshow-controls-title'
);
const slideshowControlsArtist = document.querySelector(
  '.slideshow-controls-artist'
);
const lightbox = document.querySelector('.lightbox');
const lightboxCloseBtn = document.querySelector('.lightbox-close-btn');
const lightboxArtworkImage = document.querySelector('.lightbox-image');

const BASE_IMG_PATH = 'assets/images/art/';

let currentLayout = getLayoutFromPageSize();
let artworks;
let currentArtwork;
let currentPage = 'gallery'; // gallery or artwork

async function fetchArtworks() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error(response.status);

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Couldn't fetch artworks. `, error);
    return null;
  }
}

function compareArrays(a, b) {
  return a.toString() === b.toString();
}

function sortArtworks(layout) {
  return artworks.sort((a, b) => a.order[layout] - b.order[layout]);
}

function renderGalleryMasonry(layout = currentLayout) {
  const colLayouts = {
    desktop: [4, 4, 3, 4],
    tablet: [7, 8],
    mobile: [15],
  };

  sortArtworks(layout);

  const colLayout = colLayouts[layout];
  const filledCols = [];
  const colElements = [];

  galleryMasonry.innerHTML = ``;

  let artworkIndex = 0;
  while (!compareArrays(filledCols, colLayout)) {
    for (let colIndex = 0; colIndex < colLayout.length; colIndex++) {
      if (filledCols[colIndex] !== colLayout[colIndex]) {
        if (!filledCols[colIndex]) {
          // first run for this column so create the column element
          const galleryColEl = document.createElement('div');
          galleryColEl.className = 'gallery-col';
          galleryMasonry.appendChild(galleryColEl);
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

    setTimeout(() => {
      item.classList.remove('hidden');
    }, delay);
  });
}

function getLayoutFromPageSize() {
  const pageWidth = window.innerWidth;

  if (pageWidth >= 800) {
    return 'desktop';
  } else if (pageWidth > 375) {
    return 'tablet';
  } else {
    return 'mobile';
  }
}

function getArtworkByIndex(artworkIndex) {
  return artworks[artworkIndex];
}

function getArtworkById(artworkId) {
  return artworks.find((artwork) => artwork.id === artworkId);
}

function updateArtworkPageMeta(artworkId) {
  const artwork = getArtworkById(artworkId);

  document.title = `${artwork.name} by ${artwork.artist.name} - galleria`;
  window.history.pushState({}, '', artwork.id);
}

function switchToPage(page) {
  if (page === 'gallery') {
    galleryMasonry.classList.remove('hidden');
    artworkDetail.classList.add('hidden');
    slideshowControls.classList.add('hidden');
  } else if (page === 'artwork') {
    galleryMasonry.classList.add('hidden');
    artworkDetail.classList.remove('hidden');
    slideshowControls.classList.remove('hidden');
  }
}

function updateSlideShowControlsMeta(artworkId) {
  const artwork = getArtworkById(artworkId);

  slideshowControlsTitle.textContent = artwork.name;
  slideshowControlsArtist.textContent = artwork.artist.name;
}

function handleSlideShowControlsProgressAction(renderPage) {
  const artworkIndex = slideshowControlsProgress.value;
  const artwork = getArtworkByIndex(artworkIndex);

  // maybe restrict it to at a min select value 1 and then update the max to 15 and -1 from the value when grabbing artwork index
  // but each slide needs to be 1 / 15th filled bar though

  // This causes a small bug where we're listening for input and change seperately so clicking the bar runs both the input and change action rendering the meta twice. but that's not a big deal atm but could look weird if we animate the controller meta updating.
  if (renderPage) {
    renderArtworkPage(artwork.id);
  } else {
    updateSlideShowControlsMeta(artwork.id);
  }
}

slideshowControlsProgress.addEventListener('input', () =>
  handleSlideShowControlsProgressAction(false)
);

slideshowControlsProgress.addEventListener('change', () =>
  handleSlideShowControlsProgressAction(true)
);

function renderArtworkPage(artworkId) {
  const artwork = getArtworkById(artworkId);
  currentArtwork = artworkId;

  updateArtworkPageMeta(artworkId);

  artworkImage.src =
    BASE_IMG_PATH + artwork.id + '/' + artwork.images.hero.large;
  artworkArtistImage.src =
    BASE_IMG_PATH + artwork.id + '/' + artwork.artist.image;
  lightboxArtworkImage.src =
    BASE_IMG_PATH + artwork.id + '/' + artwork.images.gallery;

  const imageAltText = `${artwork.name} by ${artwork.artist.name}`;
  artworkImage.alt = imageAltText;
  lightboxArtworkImage.alt = imageAltText;
  artworkArtistImage.alt = `Portrait of ${artwork.artist.name}`;

  artworkTitle.textContent = artwork.name;
  artworkArtist.textContent = artwork.artist.name;
  artworkYear.textContent = artwork.year;
  artworkDescription.textContent = artwork.description;
  artworkSourceLink.href = artwork.source;

  updateSlideShowControlsMeta(artworkId);

  switchToPage('artwork');
}

function toggleLightbox() {
  lightbox.classList.toggle('hidden');
}

lightboxCloseBtn.addEventListener('click', toggleLightbox);
ViewImageBtn.addEventListener('click', toggleLightbox);

function handleGalleryAction(event) {
  const clickedElement = event.target;
  const galleryItem = clickedElement.closest('.gallery-item');

  if (!galleryItem) return;

  event.preventDefault();

  const selectedArtworkId = galleryItem.getAttribute('data-artwork-id');
  renderArtworkPage(selectedArtworkId);
}

galleryMasonry.addEventListener('click', handleGalleryAction);

function handleLightboxAction(event) {
  const clickedElement = event.target;

  const isOverlay =
    clickedElement.classList.contains('lightbox') ||
    clickedElement.classList.contains('lightbox-wrapper');
  if (!isOverlay) return;

  toggleLightbox();
}

lightbox.addEventListener('click', handleLightboxAction);

function handleGalleryMasonryResize() {
  const newLayout = getLayoutFromPageSize();

  if (newLayout !== currentLayout) {
    currentLayout = newLayout;
    renderGalleryMasonry();
  }
}

window.addEventListener('resize', handleGalleryMasonryResize);

async function init() {
  artworks = await fetchArtworks();

  if (artworks && artworks.length > 0) {
    renderGalleryMasonry();
  } else {
    galleryMasonry.innerHTML = `<p class="text-preset-5">Couldn't fetch artworks.</p>`;
  }
}

init();

// use js to order the items into the right column on tablet and mobile
// add auto play to slideshow
// make progress bar clickable /draggable to change which image they're looking at and ensure clickable area is taller for that.
// when each slideshow page loads edit title and url to the right name. also animate the different parts to animate in differently and fade in/slide in etc. and fade out the current slide in the inverse way.
// maybe use a class with methods for the slideshow controller so we can store the current index, go forward, back, to specific index etc.

// avoid big innerhtml blocks of code and use html template then edit the template and clone it in js as needed
// add dropshadow to header and footer when the page isn't scrolled all the way to their bottom or top.
// when dragging the input range slider update the title and artist in real time in the footer info and the buttons but don't load the content until they let go to avoid weirdness
// animate the slideshow controls footer to slide up / down out of the page with js when on the main / artwork page
