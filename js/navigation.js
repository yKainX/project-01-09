export function showView(id) {
  document.querySelectorAll('.view').forEach((view) => view.classList.remove('active-view'));
  const target = document.querySelector(id);
  target.classList.add('active-view');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
