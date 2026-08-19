import { saveState } from './storage.js';

export function bindPlayers(state) {
  document.querySelectorAll('.play-button').forEach((button) => {
    button.addEventListener('click', () => {
      const player = button.closest('.audio-player');
      const playing = player.classList.toggle('playing');
      button.textContent = playing ? 'Ⅱ' : '▶';
      if (playing && !state.playedAudio.includes(player.dataset.id)) {
        state.playedAudio.push(player.dataset.id);
        saveState(state);
      }
    });
  });
}
