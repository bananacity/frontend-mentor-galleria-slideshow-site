import { API_URL } from '../config.js';

export async function fetchArtworks() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(response.status);

    return await response.json();
  } catch (error) {
    console.error(`Couldn't fetch artworks. `, error);
    return null;
  }
}
