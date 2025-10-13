const galleryMasonry = document.querySelector('.gallery-masonry');

const BASE_IMG_PATH = 'assets/images/art/';
let artworks;

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
  artworks = artworks.sort((a, b) => a.order[layout] - b.order[layout]);
  return artworks;
}

function renderGalleryMasonry(layout = 'desktop') {
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
    const delay = Math.max(group * 150, 250);

    setTimeout(() => {
      item.classList.remove('hidden');
    }, delay);
  });
}

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
// when page resized run function to check if the layout changed if so then rerun rendergallerymasonry with the new layout
