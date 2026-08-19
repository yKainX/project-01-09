import { saveState } from './storage.js';

export function bindGallery(state) {
  document.querySelectorAll('.polaroid, [data-image]').forEach((photo) => photo.addEventListener('click', () => {
    const backdrop = document.querySelector('#modal-backdrop');
    const content = document.querySelector('#modal-content');
    content.innerHTML = photo.dataset.image
      ? `<img class="modal-image" src="${photo.dataset.image}" alt="${photo.dataset.title}" /><h3 id="modal-title">${photo.dataset.title}</h3><p>${photo.dataset.caption}</p>`
      : `<div class="modal-visual" style="--modal-tone:${photo.dataset.tone}"><span>${photo.dataset.mark}</span></div><h3 id="modal-title">${photo.dataset.title}</h3><p>${photo.dataset.caption}</p>`;
    document.dispatchEvent(new CustomEvent('maria:modalopen', { detail: photo }));
    backdrop.classList.add('open'); backdrop.setAttribute('aria-hidden', 'false');
    document.querySelector('#modal-close').focus();
    if (!state.seenPhotos.includes(photo.dataset.id)) { state.seenPhotos.push(photo.dataset.id); saveState(state); }
  }));
}
