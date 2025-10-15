export const homeLink = document.querySelector('.site-header-logo');

export const galleryMasonry = document.querySelector('.gallery-masonry');
export const artworkDetail = document.querySelector('.artwork-detail');

// Artwork view
export const artworkImage = document.querySelector('.artwork-image');
export const ViewImageBtn = document.querySelector('.view-image-btn');
export const artworkInfo = document.querySelector('.artwork-info');
export const artworkInfoWrapper = document.querySelector(
  '.artwork-info-wrapper'
);
export const artworkTitle = document.querySelector('.artwork-title');
export const artworkArtist = document.querySelector('.artwork-artist');
export const artworkArtistImage = document.querySelector(
  '.artwork-artist-portrait'
);
export const artworkYear = document.querySelector('number-flow');
export const artworkDescription = document.querySelector(
  '.artwork-description'
);
export const artworkSourceLink = document.querySelector('.artwork-source-link');

// Slideshow controls
export const slideshowControls = document.querySelector('.slideshow-controls');
export const slideshowControlsToggle =
  document.querySelector('.slideshow-toggle');
export const slideshowAutoPlayProgress = document.querySelector(
  '.site-header-wrapper'
);
export const slideshowControlsProgress = document.querySelector(
  '.slideshow-controls-progress'
);
export const slideshowControlsTitle = document.querySelector(
  '.slideshow-controls-title'
);
export const slideshowControlsArtist = document.querySelector(
  '.slideshow-controls-artist'
);
export const slideshowControlsPrevBtn =
  document.querySelector('.control-btn-prev');
export const slideshowControlsNextBtn =
  document.querySelector('.control-btn-next');
export const slideshowControlsWrapper = document.querySelector(
  '.slideshow-controls-wrapper'
);

// Lightbox
export const lightbox = document.querySelector('.lightbox');
export const lightboxCloseBtn = document.querySelector('.lightbox-close-btn');
export const lightboxArtworkImage = document.querySelector('.lightbox-image');

// Numberflow setup
import 'https://esm.sh/number-flow';
artworkYear.format = { useGrouping: false };
