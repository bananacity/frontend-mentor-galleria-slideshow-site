let artworks = [];
let currentLayout = 'desktop'; // desktop, tablet, mobile
let currentPage = 'gallery'; // gallery or artwork
let currentArtworkId = null;

export function getArtworks() {
  return artworks;
}

export function setArtworks(data) {
  artworks = data;
}

export function getCurrentLayout() {
  return currentLayout;
}

export function setCurrentLayout(layout) {
  currentLayout = layout;
}

export function getCurrentPage() {
  return currentPage;
}

export function setCurrentPage(page) {
  currentPage = page;
}

export function getCurrentArtworkId() {
  return currentArtworkId;
}

export function setCurrentArtworkId(id) {
  currentArtworkId = id;
}

// Helper functions
export function getArtworkByIndex(artworkIndex) {
  return artworks[artworkIndex];
}

export function getArtworkById(artworkId) {
  return artworks.find((artwork) => artwork.id === artworkId);
}

export function getArtworkIndexById(artworkId) {
  const artwork = getArtworkById(artworkId);
  return artworks.indexOf(artwork);
}

export function sortArtworks(layout) {
  return getArtworks().sort((a, b) => a.order[layout] - b.order[layout]);
}
