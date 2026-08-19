export function unlockedCount(state, total) { return Math.min(total, state.completed.length + 1); }

export function updateProgress(state, total) {
  const current = unlockedCount(state, total);
  document.querySelector('#progress-label').textContent = `${current} de ${total}`;
  document.querySelector('#progress-bar').style.width = `${(current / total) * 100}%`;
}
