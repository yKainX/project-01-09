import { loadState, saveState } from './storage.js';
import { unlockedCount, updateProgress } from './progress.js';
import { showView } from './navigation.js';
import { toast } from './animations.js';
import { bindPlayers } from './audio.js';
import { bindGallery } from './gallery.js';
import { bindMusicPlayers } from './music.js';
import { bindMemoryCarousels } from './memory-carousel.js';
import { bindLoveInteractions } from './love-interactions.js';
import { chapters, contentFor } from './timeline.js?v=music-30s-16';
import { mountQualityGame } from './game.js';

const ACCESS_CODE = '0105';
const ACCESS_KEY = 'maria-access-granted';
const state = loadState();
const chapterContainer = document.querySelector('#chapters');
const app = document.querySelector('#app');
const accessScreen = document.querySelector('#access-screen');
const accessForm = document.querySelector('#access-form');
const accessCode = document.querySelector('#access-code');
const accessError = document.querySelector('#access-error');
const chapterView = document.querySelector('#chapter-view');
let lastFocusedElement;
let currentChapterIndex = null;

function renderChapters() {
  const unlocked = unlockedCount(state, chapters.length);
  chapterContainer.innerHTML = chapters.map((chapter, index) => {
    const done = state.completed.includes(index);
    const locked = index >= unlocked;
    const isActive = currentChapterIndex === index;
    return `<button class="chapter-card ${locked ? 'locked' : ''} ${done ? 'done' : ''} ${isActive ? 'active' : ''}" type="button" data-chapter="${index}" aria-label="${chapter.title}${locked ? ', bloqueado' : ''}" aria-disabled="${locked}" ${isActive ? 'aria-current="page"' : ''}><span class="card-no">${String(index + 1).padStart(2, '0')}</span><span class="card-body"><strong>${chapter.title}</strong><small>${locked ? 'Aguardando você' : chapter.subtitle}</small></span><span class="card-state">${done ? '✓' : locked ? '⌕' : '→'}</span></button>`;
  }).join('');
  chapterContainer.querySelectorAll('[data-chapter]').forEach((item) => item.addEventListener('click', () => openChapter(Number(item.dataset.chapter))));
  updateProgress(state, chapters.length);
}

function resolveContinueIndex() {
  const preferred = Number.isInteger(state.lastChapterViewed) ? state.lastChapterViewed : state.completed.length;
  const highestUnlocked = Math.max(0, unlockedCount(state, chapters.length) - 1);
  return Math.min(Math.max(preferred, 0), highestUnlocked);
}

function openChapter(index, writeHistory = true) {
  if (!Number.isInteger(index) || index < 0 || index >= chapters.length) {
    goHome(false);
    return;
  }
  if (index >= unlockedCount(state, chapters.length)) {
    toast(index === 1 ? '🌸 Ainda não chegamos nessa lembrança.' : 'Continue explorando. Ainda existem memórias esperando por você.');
    return;
  }

  const chapter = chapters[index];
  currentChapterIndex = index;
  state.lastChapterViewed = index;
  saveState(state);
  chapterView.innerHTML = `<article class="chapter-page chapter-experience chapter-type-${chapter.type}"><header class="chapter-cover"><button class="back-button" id="back-button" type="button">← voltar para nós</button><span class="chapter-number">CENA ${String(index + 1).padStart(2, '0')}</span><h2 class="chapter-title">${chapter.title}</h2><p class="chapter-intro">${chapter.intro}</p><span class="cover-mark" aria-hidden="true">✦</span></header><div class="content-area">${contentFor(chapter)}</div><div class="complete-row"><button class="complete-button ${state.completed.includes(index) ? 'completed' : ''}" id="complete-button" type="button" ${state.completed.includes(index) ? 'disabled' : ''}>${state.completed.includes(index) ? 'Lembrança guardada ✓' : 'Guardar esta lembrança'}</button></div></article>`;
  renderChapters();
  showView('#chapter-view');
  if (writeHistory) history.pushState({ chapter: index }, '', `#capitulo-${index + 1}`);

  const backButton = document.querySelector('#back-button');
  const completeButton = document.querySelector('#complete-button');
  backButton?.addEventListener('click', () => goHome());
  completeButton?.addEventListener('click', () => completeChapter(index));
  bindPlayers(state);
  bindGallery(state);
  bindMusicPlayers();
  bindMemoryCarousels();
  backButton?.focus();
}

function goHome(writeHistory = true) {
  currentChapterIndex = null;
  renderChapters();
  showView('#home');
  if (writeHistory) history.pushState({ home: true }, '', '#home');
}

function completeChapter(index) {
  if (state.completed.includes(index)) return;
  state.completed.push(index);
  state.completed.sort((a, b) => a - b);
  saveState(state);
  renderChapters();
  toast(index < chapters.length - 1 ? 'Novo capítulo desbloqueado. ✦' : 'Todas as lembranças foram guardadas.');
  const button = document.querySelector('#complete-button');
  if (!button) return;
  button.textContent = 'Lembrança guardada ✓';
  button.classList.add('completed');
  button.disabled = true;
}

function closeModal() {
  document.querySelector('#modal-backdrop').classList.remove('open');
  document.querySelector('#modal-backdrop').setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  lastFocusedElement?.focus();
}

function syncRoute() {
  const match = location.hash.match(/^#capitulo-(\d+)$/);
  if (match) openChapter(Number(match[1]) - 1, false);
  else goHome(false);
}

function unlockExperience() {
  app.removeAttribute('inert');
  accessScreen.classList.add('is-hidden');
  accessError.hidden = true;
  syncRoute();
}

accessForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (accessCode.value === ACCESS_CODE) {
    sessionStorage.setItem(ACCESS_KEY, 'true');
    unlockExperience();
    return;
  }
  accessError.hidden = false;
  accessCode.select();
});

document.querySelector('#continue-button').addEventListener('click', () => openChapter(resolveContinueIndex()));
document.querySelector('.brand').addEventListener('click', (event) => { event.preventDefault(); goHome(); });
document.querySelector('#modal-close').addEventListener('click', closeModal);
document.querySelector('#modal-backdrop').addEventListener('click', (event) => { if (event.target.id === 'modal-backdrop') closeModal(); });
document.addEventListener('maria:modalopen', (event) => {
  lastFocusedElement = event.detail;
  document.body.classList.add('modal-open');
});
document.addEventListener('keydown', (event) => {
  const backdrop = document.querySelector('#modal-backdrop');
  if (!backdrop.classList.contains('open')) return;
  if (event.key === 'Escape') { closeModal(); return; }
  if (event.key === 'Tab') {
    event.preventDefault();
    document.querySelector('#modal-close').focus();
  }
});
window.addEventListener('popstate', syncRoute);

renderChapters();
mountQualityGame();
bindLoveInteractions();
window.setTimeout(() => {
  document.querySelector('#boot-screen').style.opacity = '0';
  document.querySelector('#boot-screen').style.pointerEvents = 'none';
  app.classList.remove('is-hidden');
  if (sessionStorage.getItem(ACCESS_KEY) === 'true') unlockExperience();
  else accessCode.focus();
  window.setTimeout(() => document.querySelector('#boot-screen').remove(), 650);
}, 2900);
