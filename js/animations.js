let timeout;
export function toast(message) {
  const element = document.querySelector('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(timeout);
  timeout = setTimeout(() => element.classList.remove('show'), 3100);
}
