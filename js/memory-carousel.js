export function bindMemoryCarousels() {
  document.querySelectorAll('.memory-carousel').forEach((carousel) => {
    const slides = [...carousel.querySelectorAll('.memory-slide')];
    const previous = carousel.querySelector('[data-carousel="previous"]');
    const next = carousel.querySelector('[data-carousel="next"]');
    const counter = carousel.querySelector('.carousel-count');
    if (!slides.length) return;

    let active = 0;
    const update = () => {
      slides.forEach((slide, index) => {
        const visible = index === active;
        slide.hidden = !visible;
        slide.classList.toggle('is-active', visible);
      });
      previous.disabled = active === 0;
      next.disabled = active === slides.length - 1;
      counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    };

    previous.addEventListener('click', () => { active = Math.max(0, active - 1); update(); });
    next.addEventListener('click', () => { active = Math.min(slides.length - 1, active + 1); update(); });
    update();
  });
}
