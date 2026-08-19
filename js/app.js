import { loadState, saveState } from './storage.js';
import { unlockedCount, updateProgress } from './progress.js';
import { showView } from './navigation.js';
import { toast } from './animations.js';
import { bindPlayers } from './audio.js';
import { bindGallery } from './gallery.js';
import { bindMusicPlayers } from './music.js';
import { bindMemoryCarousels } from './memory-carousel.js';
import { bindLoveInteractions } from './love-interactions.js';
import { activityFor, chapters, contentFor } from './timeline.js?v=text-sync-25';
import { mountQualityGame } from './game.js';

const ACCESS_CODE = '0105';
const ACCESS_KEY = 'maria-access-granted';
const JOURNEY_VERSION_KEY = 'maria-story-flow-18';
const state = loadState();
if (localStorage.getItem(JOURNEY_VERSION_KEY) !== 'ready') {
  state.completed = [];
  state.lastChapterViewed = null;
  saveState(state);
  localStorage.setItem(JOURNEY_VERSION_KEY, 'ready');
}
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
  const storyFinished = state.completed.length === chapters.length;
  const chapterList = chapterContainer.closest('.chapter-list');
  const menuTitle = chapterList.querySelector('.section-heading span');
  const menuSubtitle = chapterList.querySelector('.section-heading small');
  chapterList.hidden = !storyFinished;
  if (storyFinished) {
    menuTitle.textContent = 'Agora você pode escolher';
    menuSubtitle.textContent = 'revisite qualquer pedacinho de nós';
  }
  chapterContainer.innerHTML = chapters.map((chapter, index) => {
    const done = state.completed.includes(index);
    const locked = index >= unlocked;
    const isActive = currentChapterIndex === index;
    return `<button class="chapter-card ${locked ? 'locked' : ''} ${done ? 'done' : ''} ${isActive ? 'active' : ''}" type="button" data-chapter="${index}" aria-label="${chapter.title}${locked ? ', bloqueado' : ''}" aria-disabled="${locked}" ${isActive ? 'aria-current="page"' : ''}><span class="card-no">${String(index + 1).padStart(2, '0')}</span><span class="card-body"><strong>${chapter.title}</strong><small>${locked ? 'Aguardando você' : chapter.subtitle}</small></span><span class="card-state">${done ? '✓' : locked ? '⌕' : '→'}</span></button>`;
  }).join('') + (storyFinished ? '<button class="chapter-card finale-menu-card" type="button" data-finale aria-label="Ver encerramento"><span class="card-no">∞</span><span class="card-body"><strong>Nosso encerramento</strong><small>um coração que nasceu de tudo isso</small></span><span class="card-state">♥</span></button>' : '');
  chapterContainer.querySelectorAll('[data-chapter]').forEach((item) => item.addEventListener('click', () => openChapter(Number(item.dataset.chapter))));
  chapterContainer.querySelector('[data-finale]')?.addEventListener('click', () => showFinale(true));
  const continueButton = document.querySelector('#continue-button');
  if (continueButton) continueButton.innerHTML = storyFinished ? 'Escolher uma lembrança <span>↓</span>' : 'Começar por nós <span>→</span>';
  updateProgress(state, chapters.length);
}

function resolveContinueIndex() {
  const highestUnlocked = Math.max(0, unlockedCount(state, chapters.length) - 1);
  return Math.min(state.completed.length, highestUnlocked);
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
  const nextLabel = index === chapters.length - 1 ? 'Guardar nossa história' : 'Seguir para a próxima lembrança →';
  chapterView.innerHTML = `<article class="chapter-page chapter-experience chapter-type-${chapter.type}"><header class="chapter-cover"><button class="back-button" id="back-button" type="button">← voltar para o começo</button><span class="chapter-number">CENA ${String(index + 1).padStart(2, '0')}</span><h2 class="chapter-title">${chapter.title}</h2><p class="chapter-intro">${chapter.intro}</p><span class="cover-mark" aria-hidden="true">✦</span></header><div class="content-area">${contentFor(chapter)}${activityFor(index)}</div><div class="complete-row"><button class="complete-button ${state.completed.includes(index) ? 'completed' : ''}" id="complete-button" type="button" ${state.completed.includes(index) ? 'disabled' : ''}>${state.completed.includes(index) ? 'Lembrança guardada ✓' : nextLabel}</button></div></article>`;
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
  bindLoveInteractions(chapterView);
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
  if (index < chapters.length - 1) window.setTimeout(() => openChapter(index + 1), 650);
  else window.setTimeout(() => showFinale(), 700);
}

function showFinale(autoplay = true, writeHistory = true) {
  currentChapterIndex = null;
  chapterView.innerHTML = `<article class="finale-page" aria-labelledby="finale-title"><div class="finale-stars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="finale-heart-wrap" aria-hidden="true"><svg class="finale-heart" viewBox="0 0 512 512" role="img"><path class="finale-heart-shape" d="M256 448S64 320 64 176c0-62 50-112 112-112 36 0 68 17 80 44 12-27 44-44 80-44 62 0 112 50 112 112 0 144-192 272-192 272Z" /></svg><span class="heart-spark spark-one">✦</span><span class="heart-spark spark-two">♡</span><span class="heart-spark spark-three">✦</span></div><section class="finale-copy"><span class="finale-months">4 meses de nós</span><span class="eyebrow">a nossa história continua</span><p class="finale-line line-one">Começou numa partida perdida em uma madrugada.</p><p class="finale-line line-two">Virou conversas, risadas e noites em call.</p><p class="finale-line line-three">Virou cuidado, música, planos e um lugar de paz.</p><h2 id="finale-title" class="finale-line line-four">E em cada pedaço,<br /><em>eu fui entendendo:</em></h2><p class="finale-love finale-line line-five">eu amo você, Maria.</p><p class="finale-promise finale-line line-six">Eu escolho você hoje e quero continuar escolhendo. Quero estar nas suas vitórias, nos seus dias difíceis, nas suas risadas sem sentido e nos nossos silêncios. Quero construir mais noites, mais histórias e um futuro em que a gente continue sendo casa um para o outro.</p><p class="finale-promise finale-line line-seven">Obrigado por ter aparecido naquela madrugada. Você transformou um acaso em uma das coisas mais bonitas que já aconteceram comigo.</p><button class="finale-music-control" id="finale-music-control" type="button">♪ Tocar Pupila</button><button class="finale-back" id="finale-back" type="button">Rever nossa história <span>↺</span></button></section><audio class="finale-audio" preload="auto" src="assets/audio/pupila.mp3"></audio></article>`;
  renderChapters();
  showView('#chapter-view');
  if (writeHistory) history.pushState({ finale: true }, '', '#final');
  document.querySelector('#finale-back')?.addEventListener('click', () => goHome());

  const audio = chapterView.querySelector('.finale-audio');
  const musicControl = chapterView.querySelector('#finale-music-control');
  if (!audio || !musicControl) return;
  let fadeFrame;
  const prepareAudio = async () => {
    if (audio.readyState >= 1) return;
    await new Promise((resolve) => audio.addEventListener('loadedmetadata', resolve, { once: true }));
  };
  const playFinalTrack = async (restart = false) => {
    await prepareAudio();
    if (restart || audio.currentTime < 60 || audio.currentTime >= 120) audio.currentTime = 60;
    if (fadeFrame) cancelAnimationFrame(fadeFrame);
    audio.volume = 0;
    try {
      await audio.play();
      musicControl.textContent = 'Ⅱ Pupila tocando';
      const startedAt = performance.now();
      const fadeIn = (now) => {
        audio.volume = Math.min(.72, ((now - startedAt) / 1200) * .72);
        if (audio.volume < .72 && !audio.paused) fadeFrame = requestAnimationFrame(fadeIn);
      };
      fadeFrame = requestAnimationFrame(fadeIn);
      return true;
    } catch {
      musicControl.textContent = '♪ Tocar Pupila';
      return false;
    }
  };
  audio.addEventListener('timeupdate', () => {
    if (audio.currentTime >= 120) {
      audio.pause();
      audio.currentTime = 60;
      musicControl.textContent = '♪ Tocar Pupila';
    }
  });
  musicControl.addEventListener('click', async () => {
    if (!audio.paused) {
      audio.pause();
      musicControl.textContent = '♪ Tocar Pupila';
      return;
    }
    await playFinalTrack(false);
  });
  if (autoplay) playFinalTrack(true);
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
  else if (location.hash === '#final') showFinale(false, false);
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

document.querySelector('#continue-button').addEventListener('click', () => {
  if (state.completed.length === chapters.length) {
    document.querySelector('.chapter-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  openChapter(resolveContinueIndex());
});
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
