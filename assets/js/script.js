import 'https://esm.sh/number-flow';

const galleryMasonry = document.querySelector('.gallery-masonry');
const artworkDetail = document.querySelector('.artwork-detail');
const artworkImage = document.querySelector('.artwork-image');
const ViewImageBtn = document.querySelector('.view-image-btn');
const artworkInfo = document.querySelector('.artwork-info');
const artworkInfoWrapper = document.querySelector('.artwork-info-wrapper');
const artworkTitle = document.querySelector('.artwork-title');
const artworkArtist = document.querySelector('.artwork-artist');
const artworkArtistImage = document.querySelector('.artwork-artist-portrait');
const artworkYear = document.querySelector('number-flow');
const artworkDescription = document.querySelector('.artwork-description');
const artworkSourceLink = document.querySelector('.artwork-source-link');
const homeLink = document.querySelector('.site-header-logo');
const slideshowControls = document.querySelector('.slideshow-controls');
const slideshowControlsToggle = document.querySelector('.slideshow-toggle');
const slideshowAutoPlayProgress = document.querySelector(
  '.site-header-wrapper'
);
const slideshowControlsProgress = document.querySelector(
  '.slideshow-controls-progress'
);
const slideshowControlsTitle = document.querySelector(
  '.slideshow-controls-title'
);
const slideshowControlsArtist = document.querySelector(
  '.slideshow-controls-artist'
);
const slideshowControlsPrevBtn = document.querySelector('.control-btn-prev');
const slideshowControlsNextBtn = document.querySelector('.control-btn-next');
const lightbox = document.querySelector('.lightbox');
const lightboxCloseBtn = document.querySelector('.lightbox-close-btn');
const lightboxArtworkImage = document.querySelector('.lightbox-image');
const slideshowControlsWrapper = document.querySelector(
  '.slideshow-controls-wrapper'
);

const BASE_IMG_PATH = 'assets/images/art/';

let currentLayout = getLayoutFromPageSize();
let artworks;
let currentArtwork;
let currentPage = 'gallery'; // gallery or artwork

// Numberflow setup
artworkYear.format = { useGrouping: false };

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

function getArtworkIndexById(artworkId) {
  const artwork = getArtworkById(artworkId);
  return artworks.indexOf(artwork);
}

window.addEventListener('popstate', () => {
  const path = window.location.pathname.slice(1);

  // only works for moving back once, would need to ensure index.html is served for all urls paths to fix it or not set url or use # instead for urls
  if (path === '') {
    switchToPage('gallery');
  } else {
    slideShowController.openSlide(getArtworkIndexById(path));
  }
});

function updateArtworkPageMeta(artworkId) {
  const artwork = getArtworkById(artworkId);

  document.title = `${artwork.name} by ${artwork.artist.name} - galleria`;
  history.pushState({}, '', artwork.id);
}

function switchToPage(page) {
  if (currentPage === page) return;

  currentPage = page;

  if (page === 'gallery') {
    document.title = `galleria: Art showcase`;
    history.pushState({}, '', '/');

    galleryMasonry.classList.remove('hidden');
    artworkDetail.classList.add('hidden');
    slideshowControls.classList.add('hidden');
  } else if (page === 'artwork') {
    galleryMasonry.classList.add('hidden');
    artworkDetail.classList.remove('hidden');
    slideshowControls.classList.remove('hidden');
  }
}

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
    const isLastSlide = this.currentIndex === artworks.length - 1;

    slideshowControlsNextBtn.disabled = this.autoPlayEnabled
      ? false
      : isLastSlide;
    slideshowControlsPrevBtn.disabled = this.autoPlayEnabled
      ? false
      : isFirstSlide;

    updateSlideshowControlsProgressValue(this.currentIndex);

    slideshowControlsToggle.textContent = this.autoPlayEnabled
      ? 'Stop Slideshow'
      : 'Start Slideshow';
  }

  openSlide(artworkIndex) {
    this.currentIndex = artworkIndex;

    const artwork = getArtworkByIndex(this.currentIndex);
    renderArtworkPage(artwork.id);
  }

  nextSlide() {
    const lastIndex = artworks.length - 1;

    if (this.currentIndex === lastIndex && this.autoPlayEnabled) {
      this.currentIndex = 0;
    } else {
      this.currentIndex = Math.min(this.currentIndex + 1, lastIndex);
    }

    const artwork = getArtworkByIndex(this.currentIndex);
    renderArtworkPage(artwork.id);
  }

  prevSlide() {
    const firstIndex = 0;
    const lastIndex = artworks.length - 1;

    if (this.currentIndex === firstIndex && this.autoPlayEnabled) {
      this.currentIndex = lastIndex;
    } else {
      this.currentIndex = Math.max(this.currentIndex - 1, 0);
    }

    const artwork = getArtworkByIndex(this.currentIndex);
    renderArtworkPage(artwork.id);
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

    if (currentPage !== 'artwork') {
      switchToPage('artwork');
      // const artwork = getArtworkByIndex(this.currentIndex);
      // renderArtworkPage(artwork.id);
    }

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

const slideShowController = new SlideShowController();

slideshowControlsToggle.addEventListener('click', () =>
  slideShowController.toggleAutoPlay()
);

slideshowControlsPrevBtn.addEventListener('click', () =>
  slideShowController.prevSlide()
);

slideshowControlsNextBtn.addEventListener('click', () =>
  slideShowController.nextSlide()
);

function updateSlideShowControlsMeta(artworkId) {
  const artwork = getArtworkById(artworkId);

  slideshowControlsTitle.textContent = artwork.name;
  slideshowControlsArtist.textContent = artwork.artist.name;
}

function handleSlideShowControlsProgressAction(renderPage) {
  const artworkIndex = Number(slideshowControlsProgress.value);
  const artwork = getArtworkByIndex(artworkIndex);

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

slideshowControlsProgress.addEventListener('input', () =>
  handleSlideShowControlsProgressAction(false)
);

slideshowControlsProgress.addEventListener('change', () =>
  handleSlideShowControlsProgressAction(true)
);

function updateSlideshowAutoPlayProgress(value) {
  slideshowAutoPlayProgress.style.setProperty(
    '--autoplay-progress',
    `${value}%`
  );
}

function updateSlideshowControlsProgressValue(value) {
  const filledPercentage = (((value + 1) / artworks.length) * 100).toFixed(2);
  slideshowControlsProgress.style.setProperty(
    '--progress-filled-width',
    `${filledPercentage}%`
  );
}

function renderArtworkPage(artworkId) {
  animateArtworkPage(true);

  switchToPage('artwork');

  setTimeout(() => {
    const artwork = getArtworkById(artworkId);
    currentArtwork = artworkId;

    slideShowController.updateControls();
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
    artworkYear.update(artwork.year);
    artworkDescription.textContent = artwork.description;
    artworkSourceLink.href = artwork.source;

    updateSlideShowControlsMeta(artworkId);

    setTimeout(() => animateArtworkPage(false), 300);
  }, 300);
}

function animateArtworkPage(hide) {
  const elements = [
    artworkImage,
    artworkInfo,
    artworkInfoWrapper,
    artworkArtistImage,
    artworkDescription,
    lightboxArtworkImage,
  ];

  for (const element of elements) {
    element.classList.toggle('hidden', hide);
  }
}

function handlePageScrollShadows() {
  const windowScroll = window.scrollY;
  const windowHeight = window.innerHeight;
  const scrollableHeight = document.documentElement.scrollHeight;

  slideshowAutoPlayProgress.classList.toggle('shadow', windowScroll > 5);
  slideshowControlsWrapper.classList.toggle(
    'shadow',
    windowScroll + windowHeight >= scrollableHeight
  );
}

document.addEventListener('scroll', handlePageScrollShadows);

function handleHomeLinkAction(event) {
  event.preventDefault();

  slideShowController.stopAutoPlay();

  if (currentPage !== 'gallery') switchToPage('gallery');
}

homeLink.addEventListener('click', handleHomeLinkAction);

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
  slideShowController.openSlide(getArtworkIndexById(selectedArtworkId));
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

// avoid big innerhtml blocks of code and use html template then edit the template and clone it in js as needed
